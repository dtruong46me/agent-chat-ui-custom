// ---- START MODIFY ----
import { HumanResponseWithEdits, SubmitType } from "../types";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { haveArgsChanged, prettifyText } from "../utils";
import { Button } from "@/components/ui/button";
// import { Undo2 } from "lucide-react";
// import { MarkdownText } from "../../markdown-text";
// import { ActionRequest, HumanInterrupt } from "@langchain/langgraph/prebuilt";
// import { toast } from "sonner";
// import { Separator } from "@/components/ui/separator";


import { Undo2, Pencil, Check, X } from "lucide-react"; // Thêm icons
import { MarkdownText } from "../../markdown-text";
import { ActionRequest, HumanInterrupt } from "@langchain/langgraph/prebuilt";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { SyntaxHighlighter } from "../../syntax-highlighter"; // Import SyntaxHighlighter
import { cn } from "@/lib/utils"; // Import cn



// Component mới để chỉnh sửa Code Block
interface CodeEditorProps {
  initialCode: string;
  language?: string;
  onChange: (newCode: string) => void;
  onSubmit: () => void; // Thêm onSubmit để xử lý khi nhấn Enter
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language, onChange, onSubmit, disabled }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(initialCode);

    const handleSave = () => {
        onChange(currentCode);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentCode(initialCode); // Reset về code ban đầu
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Cmd/Ctrl + Enter
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
        onSubmit(); // Gọi cả hàm submit chung của form
        }
        // Cho phép Tab trong textarea
        if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const value = e.currentTarget.value;
        // Thêm 2 dấu cách thay vì tab
        e.currentTarget.value = value.substring(0, start) + '  ' + value.substring(end);
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
        setCurrentCode(e.currentTarget.value); // Cập nhật state
        }
    };

    if (isEditing) {
        return (
            <div className="w-full">
                <Textarea
                    value={currentCode}
                    onChange={(e) => setCurrentCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className="h-auto min-h-[100px] w-full resize-y font-mono text-sm" // Style cho code editor
                    rows={Math.max(5, currentCode.split('\n').length)} // Số dòng tự động
                />
                <div className="mt-2 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancel} disabled={disabled}>Cancel</Button>
                    <Button variant="secondary" size="sm" onClick={handleSave} disabled={disabled}>Save</Button>
                </div>
            </div>
        );
    }

    // Xác định language cho highlighter
    const detectedLanguage = language || 'plaintext'; // Mặc định là plaintext nếu không có

    return (
        <div className="group relative w-full rounded-md border bg-gray-900 font-mono text-sm text-white">
            <SyntaxHighlighter language={detectedLanguage} className="!p-3">
                 {/* Thêm một dòng trống cuối nếu chưa có để dễ nhìn hơn */}
                {currentCode.endsWith('\n') ? currentCode : currentCode + '\n'}
            </SyntaxHighlighter>
             {!disabled && (
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => setIsEditing(true)}
                 >
                    <Pencil className="h-4 w-4 text-gray-400" />
                 </Button>
             )}
        </div>
    );
};


// Component Yes/No
function YesNoComponent({
  streaming,
  actionRequestArgs,
  handleSubmitAccept,
  handleSubmitDecline,
}: {
  streaming: boolean;
  actionRequestArgs: Record<string, any>;
  handleSubmitAccept: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  handleSubmitDecline: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      {/* Hiển thị args nếu có */}
      {actionRequestArgs && Object.keys(actionRequestArgs).length > 0 && (
         <div className="mb-2 w-full border-b border-border pb-2">
            <ArgsRenderer args={actionRequestArgs} />
         </div>
      )}
      <p className="text-sm text-muted-foreground mb-2">Do you want to proceed?</p>
      <div className="flex w-full justify-end gap-2">
        <Button
          variant="outline"
          disabled={streaming}
          onClick={handleSubmitDecline}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          <X className="mr-1 h-4 w-4" /> Decline
        </Button>
         <Button
          variant="secondary" // Hoặc 'default'
          disabled={streaming}
          onClick={handleSubmitAccept}
          className="bg-green-600 text-white hover:bg-green-700" // Custom style for accept
        >
          <Check className="mr-1 h-4 w-4" /> Accept
        </Button>
      </div>
    </div>
  );
}


function ResetButton({ handleReset }: { handleReset: () => void }) {
  return (
    <Button
      onClick={handleReset}
      variant="ghost"
      className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-500"
    >
      <Undo2 className="h-4 w-4" />
      <span>Reset</span>
    </Button>
  );
}

function ArgsRenderer({ args }: { args: Record<string, any> }) {
  return (
    <div className="flex w-full flex-col items-start gap-6">
      {Object.entries(args).map(([k, v]) => {
        let value = "";
        if (["string", "number"].includes(typeof v)) {
          value = v.toString();
        } else {
          value = JSON.stringify(v, null);
        }

        return (
          <div
            key={`args-${k}`}
            className="flex w-full flex-col items-start gap-1"
          >
            {/* ---- FIX: Đổi text-gray-600 thành text-muted-foreground ---- */}
            <p className="text-sm leading-[18px] text-wrap text-muted-foreground">
              {prettifyText(k)}:
            </p>
            {/* ---- FIX: Bỏ span nền sáng, dùng div với text-foreground ---- */}
            <div className="w-full max-w-full text-[13px] leading-[18px] text-foreground">
              <MarkdownText>{value}</MarkdownText>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface InboxItemInputProps {
  interruptValue: HumanInterrupt;
  humanResponse: HumanResponseWithEdits[];
  supportsMultipleMethods: boolean;
  acceptAllowed: boolean;
  hasEdited: boolean;
  hasAddedResponse: boolean;
  initialValues: Record<string, string>;

  streaming: boolean;
  streamFinished: boolean;

  setHumanResponse: React.Dispatch<
    React.SetStateAction<HumanResponseWithEdits[]>
  >;
  setSelectedSubmitType: React.Dispatch<
    React.SetStateAction<SubmitType | undefined>
  >;
  setHasAddedResponse: React.Dispatch<React.SetStateAction<boolean>>;
  setHasEdited: React.Dispatch<React.SetStateAction<boolean>>;

  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent,
  ) => Promise<void>;
}

function ResponseComponent({
  humanResponse,
  streaming,
  showArgsInResponse,
  interruptValue,
  onResponseChange,
  handleSubmit,
}: {
  humanResponse: HumanResponseWithEdits[];
  streaming: boolean;
  showArgsInResponse: boolean;
  interruptValue: HumanInterrupt;
  onResponseChange: (change: string, response: HumanResponseWithEdits) => void;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent,
  ) => Promise<void>;
}) {
  const res = humanResponse.find((r) => r.type === "response");
  if (!res || typeof res.args !== "string") {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
     <div className="flex w-full flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"> {/* Giảm padding, gap, đổi style */}
      <div className="flex w-full items-center justify-between">
        <p className="text-sm font-medium text-foreground"> {/* Giảm font */}
          Respond to assistant
        </p>
        <ResetButton
          handleReset={() => {
            onResponseChange("", res);
          }}
        />
      </div>

       {showArgsInResponse && (
         <div className="mb-2 w-full border-b border-border pb-2"> {/* Thêm border */}
           <ArgsRenderer args={interruptValue.action_request.args} />
         </div>
       )}

      <div className="flex w-full flex-col items-start gap-1"> {/* Giảm gap */}
        <p className="min-w-fit text-xs font-medium text-muted-foreground">Response</p> {/* Giảm font, đổi màu */}
        <Textarea
          disabled={streaming}
          value={res.args}
          onChange={(e) => onResponseChange(e.target.value, res)}
          onKeyDown={handleKeyDown}
          rows={3} // Giảm số dòng mặc định
          placeholder="Your response here..."
          className="text-sm" // Giảm font chữ
        />
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <Button
          size="sm" // Giảm size nút
          variant="default" // Đổi thành default
          disabled={streaming}
          onClick={handleSubmit}
        >
          Send Response
        </Button>
      </div>
    </div>
  );
}
const Response = React.memo(ResponseComponent);

function AcceptComponent({
  streaming,
  actionRequestArgs,
  handleSubmit,
}: {
  streaming: boolean;
  actionRequestArgs: Record<string, any>;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent,
  ) => Promise<void>;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-lg border-[1px] border-gray-300 p-6">
      {actionRequestArgs && Object.keys(actionRequestArgs).length > 0 && (
        <ArgsRenderer args={actionRequestArgs} />
      )}
      <Button
        variant="brand"
        disabled={streaming}
        onClick={handleSubmit}
        className="w-full"
      >
        Accept
      </Button>
    </div>
  );
}

function EditAndOrAcceptComponent({
  humanResponse,
  streaming,
  initialValues,
  onEditChange,
  handleSubmit,
  interruptValue,
}: {
  humanResponse: HumanResponseWithEdits[];
  streaming: boolean;
  initialValues: Record<string, string>;
  interruptValue: HumanInterrupt;
  onEditChange: (
    text: string | string[],
    response: HumanResponseWithEdits,
    key: string | string[],
  ) => void;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent,
  ) => Promise<void>;
}) {
  const defaultRows = React.useRef<Record<string, number>>({});
  const editResponse = humanResponse.find((r) => r.type === "edit");
  const acceptResponse = humanResponse.find((r) => r.type === "accept");
  if (
    !editResponse ||
    typeof editResponse.args !== "object" ||
    !editResponse.args
  ) {
    if (acceptResponse) {
      return (
        <AcceptComponent
          actionRequestArgs={interruptValue.action_request.args}
          streaming={streaming}
          handleSubmit={handleSubmit}
        />
      );
    }
    return null;
  }
  const header = editResponse.acceptAllowed ? "Edit/Accept" : "Edit";
  let buttonText = "Submit";
  if (editResponse.acceptAllowed && !editResponse.editsMade) {
    buttonText = "Accept";
  }

  const handleReset = () => {
    if (
      !editResponse ||
      typeof editResponse.args !== "object" ||
      !editResponse.args ||
      !editResponse.args.args
    ) {
      return;
    }
    // use initialValues to reset the text areas
    const keysToReset: string[] = [];
    const valuesToReset: string[] = [];
    Object.entries(initialValues).forEach(([k, v]) => {
      if (k in (editResponse.args as Record<string, any>).args) {
        const value = ["string", "number"].includes(typeof v)
          ? v
          : JSON.stringify(v, null);
        keysToReset.push(k);
        valuesToReset.push(value);
      }
    });

    if (keysToReset.length > 0 && valuesToReset.length > 0) {
      onEditChange(valuesToReset, editResponse, keysToReset);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"> {/* Giảm padding, gap, đổi style */}
      <div className="flex w-full items-center justify-between">
         <p className="text-sm font-medium text-foreground">{header}</p> {/* Giảm font */}
        <ResetButton handleReset={handleReset} />
      </div>

      {Object.entries(editResponse.args.args).map(([k, v], idx) => {
        let value = "";
        let isCode = false;
        let language = 'plaintext'; // Ngôn ngữ mặc định

        if (typeof v === 'string') {
          // Kiểm tra xem có phải là code block không
          const codeBlockMatch = v.match(/^```(\w+)?\n([\s\S]*)\n```$/) || v.match(/^`([^`]+)`$/);
          if (codeBlockMatch) {
            isCode = true;
            language = codeBlockMatch[1] || 'plaintext'; // Lấy ngôn ngữ nếu có
            value = codeBlockMatch[2] || codeBlockMatch[1]; // Lấy nội dung code
          } else {
             value = v;
          }
        } else if (typeof v === 'number') {
            value = v.toString();
        } else {
            value = JSON.stringify(v, null, 2); // Giả sử là JSON nếu không phải string/number
            language = 'json';
            isCode = true; // Coi JSON như code để dùng CodeEditor
        }

        // ... (Tính toán numRows như cũ)
         const numRows =
          defaultRows.current[k as keyof typeof defaultRows.current] || 5; // Giảm số dòng mặc định


        return (
          <div
            className="flex h-full w-full flex-col items-start gap-1" // Giảm gap
            key={`allow-edit-args--${k}-${idx}`}
          >
            <div className="flex w-full flex-col items-start gap-1"> {/* Giảm gap */}
              <p className="min-w-fit text-xs font-medium text-muted-foreground">{prettifyText(k)}</p> {/* Giảm font, đổi màu */}
              {isCode ? (
                <CodeEditor
                    initialCode={value}
                    language={language}
                    disabled={streaming}
                    onChange={(newCode) => {
                         // Format lại code block nếu cần khi lưu
                         const formattedCode = language === 'json' ? newCode : "```" + language + "\n" + newCode + "\n```";
                         onEditChange(formattedCode, editResponse, k);
                    }}
                    onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.KeyboardEvent)} // Trigger submit on Ctrl+Enter from CodeEditor
                />
              ) : (
                <Textarea
                  disabled={streaming}
                  className="h-full text-sm" // Giảm font
                  value={value}
                  onChange={(e) => onEditChange(e.target.value, editResponse, k)}
                  onKeyDown={handleKeyDown}
                  rows={numRows}
                />
              )}
            </div>
          </div>
        );
      })}

      <div className="flex w-full items-center justify-end gap-2">
        <Button
           size="sm" // Giảm size nút
           variant="default" // Đổi thành default
           disabled={streaming}
           onClick={handleSubmit}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
// const EditAndOrAccept = React.memo(EditAndOrAcceptComponent);
// }
const EditAndOrAccept = React.memo(EditAndOrAcceptComponent);

export function InboxItemInput({
  interruptValue,
  humanResponse,
  streaming,
  streamFinished,
  supportsMultipleMethods,
  acceptAllowed,
  hasEdited,
  hasAddedResponse,
  initialValues,
  setHumanResponse,
  setSelectedSubmitType,
  setHasEdited,
  setHasAddedResponse,
  handleSubmit,
}: InboxItemInputProps) {
  const isEditAllowed = interruptValue.config.allow_edit;
  const isResponseAllowed = interruptValue.config.allow_respond;
  const hasArgs = Object.entries(interruptValue.action_request.args).length > 0;
  const showArgsInResponse =
    hasArgs && !isEditAllowed && !acceptAllowed && isResponseAllowed;
  const showArgsOutsideActionCards =
    hasArgs && !showArgsInResponse && !isEditAllowed && !acceptAllowed;

let hitlType: 'yesno' | 'text' | 'edit' | 'accept_only' | 'none' = 'none';

  const hasOnlyBooleanArgs = hasArgs && Object.values(interruptValue.action_request.args).every(v => typeof v === 'boolean');
  const isYesNo = acceptAllowed && isResponseAllowed && hasOnlyBooleanArgs; // Điều kiện cho Yes/No
  const isEditOrCodeEdit = isEditAllowed;
  const isText = isResponseAllowed && !isEditAllowed && !isYesNo && !acceptAllowed; // Chỉ cho nhập text
  const isAcceptOnly = acceptAllowed && !isEditAllowed && !isResponseAllowed;

  if (isYesNo) {
      hitlType = 'yesno';
  } else if (isEditOrCodeEdit) {
      hitlType = 'edit'; // Sẽ render CodeEditor bên trong nếu cần
  } else if (isText) {
      hitlType = 'text';
  } else if (isAcceptOnly) {
      hitlType = 'accept_only';
  }

  // Đổi kiểu của `e` để chấp nhận cả MouseEvent và KeyboardEvent
  const handleSubmitDecline = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Element>) => {
      const declineResponse = humanResponse.find(r => r.type === 'ignore');
      if (declineResponse) {
          setSelectedSubmitType('ignore'); // Lỗi 1 được sửa bằng cách cập nhật type SubmitType
          await handleSubmit(e); // Gọi handleSubmit gốc
      } else {
          toast.error("Decline action not configured.");
      }
  };

  // Đổi kiểu của `e` để chấp nhận cả MouseEvent và KeyboardEvent
  const handleSubmitAccept = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Element>) => {
      const acceptResponse = humanResponse.find(r => r.type === 'accept');
      if (acceptResponse) {
          setSelectedSubmitType('accept');
          await handleSubmit(e); // Gọi handleSubmit gốc
      } else {
          toast.error("Accept action not configured.");
      }
  };

  const onEditChange = (
    change: string | string[],
    response: HumanResponseWithEdits,
    key: string | string[],
  ) => {
    if (
      (Array.isArray(change) && !Array.isArray(key)) ||
      (!Array.isArray(change) && Array.isArray(key))
    ) {
      toast.error("Error", {
        description: "Something went wrong",
        richColors: true,
        closeButton: true,
      });
      return;
    }

    let valuesChanged = true;
    if (typeof response.args === "object") {
      const updatedArgs = { ...(response.args?.args || {}) };

      if (Array.isArray(change) && Array.isArray(key)) {
        // Handle array inputs by mapping corresponding values
        change.forEach((value, index) => {
          if (index < key.length) {
            updatedArgs[key[index]] = value;
          }
        });
      } else {
        // Handle single value case
        updatedArgs[key as string] = change as string;
      }

      const haveValuesChanged = haveArgsChanged(updatedArgs, initialValues);
      valuesChanged = haveValuesChanged;
    }

    if (!valuesChanged) {
      setHasEdited(false);
      if (acceptAllowed) {
        setSelectedSubmitType("accept");
      } else if (hasAddedResponse) {
        setSelectedSubmitType("response");
      }
    } else {
      setSelectedSubmitType("edit");
      setHasEdited(true);
    }

    setHumanResponse((prev) => {
      if (typeof response.args !== "object" || !response.args) {
        console.error(
          "Mismatched response type",
          !!response.args,
          typeof response.args,
        );
        return prev;
      }

      const newEdit: HumanResponseWithEdits = {
        type: response.type,
        args: {
          action: response.args.action,
          args:
            Array.isArray(change) && Array.isArray(key)
              ? {
                  ...response.args.args,
                  ...Object.fromEntries(key.map((k, i) => [k, change[i]])),
                }
              : {
                  ...response.args.args,
                  [key as string]: change as string,
                },
        },
      };
      if (
        prev.find(
          (p) =>
            p.type === response.type &&
            typeof p.args === "object" &&
            p.args?.action === (response.args as ActionRequest).action,
        )
      ) {
        return prev.map((p) => {
          if (
            p.type === response.type &&
            typeof p.args === "object" &&
            p.args?.action === (response.args as ActionRequest).action
          ) {
            if (p.acceptAllowed) {
              return {
                ...newEdit,
                acceptAllowed: true,
                editsMade: valuesChanged,
              };
            }

            return newEdit;
          }
          return p;
        });
      } else {
        throw new Error("No matching response found");
      }
    });
  };

  const onResponseChange = (
    change: string,
    response: HumanResponseWithEdits,
  ) => {
    if (!change) {
      setHasAddedResponse(false);
      if (hasEdited) {
        // The user has deleted their response, so we should set the submit type to
        // `edit` if they've edited, or `accept` if it's allowed and they have not edited.
        setSelectedSubmitType("edit");
      } else if (acceptAllowed) {
        setSelectedSubmitType("accept");
      }
    } else {
      setSelectedSubmitType("response");
      setHasAddedResponse(true);
    }

    setHumanResponse((prev) => {
      const newResponse: HumanResponseWithEdits = {
        type: response.type,
        args: change,
      };

      if (prev.find((p) => p.type === response.type)) {
        return prev.map((p) => {
          if (p.type === response.type) {
            if (p.acceptAllowed) {
              return {
                ...newResponse,
                acceptAllowed: true,
                editsMade: !!change,
              };
            }
            return newResponse;
          }
          return p;
        });
      } else {
        throw new Error("No human response found for string response");
      }
    });
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {/* */}
      {/* Render component dựa trên hitlType */}
       {hitlType === 'none' && (
         <p className="text-sm text-muted-foreground p-4 text-center w-full">No action required from user.</p>
       )}

      {showArgsOutsideActionCards && hitlType !== 'yesno' && hitlType !== 'accept_only' && (
         <div className="w-full rounded-lg border border-border bg-card p-4 shadow-sm mb-3">
             <ArgsRenderer args={interruptValue.action_request.args} />
         </div>
      )}

      {hitlType === 'yesno' && (
        <YesNoComponent
          streaming={streaming}
          actionRequestArgs={interruptValue.action_request.args}
          handleSubmitAccept={handleSubmitAccept}
          handleSubmitDecline={handleSubmitDecline}
        />
      )}

      {hitlType === 'edit' && (
          <EditAndOrAccept
            humanResponse={humanResponse}
            streaming={streaming}
            initialValues={initialValues}
            interruptValue={interruptValue}
            onEditChange={onEditChange}

            handleSubmit={async (e) => {
                 if (acceptAllowed && !hasEdited) {
                     setSelectedSubmitType('accept');
                 } else {
                     setSelectedSubmitType('edit');
                 }
                 await handleSubmit(e); // Sử dụng await vì handleSubmit gốc là async
            }}
          />
      )}

      {hitlType === 'text' && (
         <Response
            humanResponse={humanResponse}
            streaming={streaming}
            showArgsInResponse={showArgsInResponse}
            interruptValue={interruptValue}
            onResponseChange={onResponseChange}

            handleSubmit={async (e) => {
                setSelectedSubmitType('response');
                await handleSubmit(e); // Sử dụng await
            }}
          />
      )}

       {hitlType === 'accept_only' && (
        <AcceptComponent
          actionRequestArgs={interruptValue.action_request.args}
          streaming={streaming}
          handleSubmit={handleSubmitAccept} // Hàm này đã được sửa ở trên để nhận đúng loại event
        />
      )}


      {/* Hiển thị thông báo streaming/finished */}
      <div className="mt-2 w-full text-center">
        {streaming && <p className="text-xs text-muted-foreground animate-pulse">Running...</p>}
        {streamFinished && (
            <p className="text-xs font-medium text-green-600">
                Invocation finished successfully.
            </p>
        )}
      </div>
      {/* */}
    </div>
  );
}
// ---- END MODIFY ----