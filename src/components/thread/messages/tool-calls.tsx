import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";

// ---- BẮT ĐẦU CHỈNH SỬA ----
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn
// ---- KẾT THÚC CHỈNH SỬA ----

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

// ---- BẮT ĐẦU CHỈNH SỬA ----
// Component con để render Tool Call riêng lẻ, có thể thu gọn
function SingleToolCall({ toolCall }: { toolCall: NonNullable<AIMessage["tool_calls"]>[number] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const args = toolCall.args as Record<string, any> || {};
  const hasArgs = Object.keys(args).length > 0;
  const argString = JSON.stringify(args, null, 2);
  const shouldTruncate = argString.length > 150 || argString.split('\n').length > 5;

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <button
        className="flex w-full items-center justify-between bg-muted/50 px-3 py-1.5 text-left text-sm font-medium transition-colors hover:bg-muted"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center gap-2">
          {/* Có thể thêm icon cho tool */}
          <span className="font-semibold">{toolCall.name}</span>
           {toolCall.id && (
             <code className="rounded bg-background px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
               ID: {toolCall.id.slice(0, 8)}...
             </code>
           )}
        </span>
        {hasArgs && (
             isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && hasArgs && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="bg-background p-3">
              <pre className="whitespace-pre-wrap break-all font-mono text-xs text-foreground">
                 {/* Chỉ hiển thị một phần nếu quá dài */}
                 {shouldTruncate ? argString.slice(0, 150) + '...' : argString}
                 {/* TODO: Implement full view */}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ---- KẾT THÚC CHỈNH SỬA ----


export function ToolCalls({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  if (!toolCalls || toolCalls.length === 0) return null;

  // ---- BẮT ĐẦU CHỈNH SỬA ----
  // Sắp xếp lại layout, giới hạn chiều rộng, căn giữa
  return (
    <div className="mx-auto w-full max-w-[80%] flex flex-col gap-2 my-2">
      <p className="text-xs text-muted-foreground font-medium mb-1 pl-1">Tool Calls:</p>
      {toolCalls.map((tc, idx) => (
         <SingleToolCall key={tc.id || `toolcall-${idx}`} toolCall={tc} />
      ))}
    </div>
  );
  // ---- KẾT THÚC CHỈNH SỬA ----
}

// export function ToolCalls({
//   toolCalls,
// }: {
//   toolCalls: AIMessage["tool_calls"];
// }) {
//   if (!toolCalls || toolCalls.length === 0) return null;

//   return (
//     <div className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
//       {toolCalls.map((tc, idx) => {
//         const args = tc.args as Record<string, any>;
//         const hasArgs = Object.keys(args).length > 0;
//         return (
//           <div
//             key={idx}
//             className="overflow-hidden rounded-lg border border-gray-200"
//           >
//             <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
//               <h3 className="font-medium text-gray-900">
//                 {tc.name}
//                 {tc.id && (
//                   <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-sm">
//                     {tc.id}
//                   </code>
//                 )}
//               </h3>
//             </div>
//             {hasArgs ? (
//               <table className="min-w-full divide-y divide-gray-200">
//                 <tbody className="divide-y divide-gray-200">
//                   {Object.entries(args).map(([key, value], argIdx) => (
//                     <tr key={argIdx}>
//                       <td className="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
//                         {key}
//                       </td>
//                       <td className="px-4 py-2 text-sm text-gray-500">
//                         {isComplexValue(value) ? (
//                           <code className="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">
//                             {JSON.stringify(value, null, 2)}
//                           </code>
//                         ) : (
//                           String(value)
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <code className="block p-3 text-sm">{"{}"}</code>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

export function ToolResult({ message }: { message: ToolMessage }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let parsedContent: any;
  let isJsonContent = false;

  try {
    if (typeof message.content === "string") {
      parsedContent = JSON.parse(message.content);
      isJsonContent = isComplexValue(parsedContent);
    }
  } catch {
    // Content is not JSON, use as is
    parsedContent = message.content;
  }

  // const contentStr = isJsonContent
  //   ? JSON.stringify(parsedContent, null, 2)
  //   : String(message.content);
  // const contentLines = contentStr.split("\n");
  // const shouldTruncate = contentLines.length > 4 || contentStr.length > 500;
  // const displayedContent =
  //   shouldTruncate && !isExpanded
  //     ? contentStr.length > 500
  //       ? contentStr.slice(0, 500) + "..."
  //       : contentLines.slice(0, 4).join("\n") + "\n..."
  //     : contentStr;

// ---- BẮT ĐẦU CHỈNH SỬA ----
  // Giả sử có trạng thái thành công/thất bại (cần logic thực tế)
  const isSuccess = true; // Placeholder
  // ---- KẾT THÚC CHỈNH SỬA ----

  const contentStr = isJsonContent
    ? JSON.stringify(parsedContent, null, 2)
    : String(message.content);
  const contentLines = contentStr.split("\n");

// ---- BẮT ĐẦU CHỈNH SỬA ----
  const maxLinesCollapsed = 3; // Số dòng tối đa khi thu gọn
  const maxLengthCollapsed = 150; // Số ký tự tối đa khi thu gọn
  const shouldTruncate = contentLines.length > maxLinesCollapsed || contentStr.length > maxLengthCollapsed;
  const displayedContent =
    shouldTruncate && !isExpanded
      ? contentStr.length > maxLengthCollapsed
        ? contentStr.slice(0, maxLengthCollapsed) + "..."
        : contentLines.slice(0, maxLinesCollapsed).join("\n") + "\n..."
      : contentStr;
  // ---- KẾT THÚC CHỈNH SỬA ----

  // return (
  //   <div className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
  //     <div className="overflow-hidden rounded-lg border border-gray-200">
  //       <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
  //         <div className="flex flex-wrap items-center justify-between gap-2">
  //           {message.name ? (
  //             <h3 className="font-medium text-gray-900">
  //               Tool Result:{" "}
  //               <code className="rounded bg-gray-100 px-2 py-1">
  //                 {message.name}
  //               </code>
  //             </h3>
  //           ) : (
  //             <h3 className="font-medium text-gray-900">Tool Result</h3>
  //           )}
  //           {message.tool_call_id && (
  //             <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-sm">
  //               {message.tool_call_id}
  //             </code>
  //           )}
  //         </div>
  //       </div>
  //       <motion.div
  //         className="min-w-full bg-gray-100"
  //         initial={false}
  //         animate={{ height: "auto" }}
  //         transition={{ duration: 0.3 }}
  //       >
  //         <div className="p-3">
  //           <AnimatePresence
  //             mode="wait"
  //             initial={false}
  //           >
  //             <motion.div
  //               key={isExpanded ? "expanded" : "collapsed"}
  //               initial={{ opacity: 0, y: 20 }}
  //               animate={{ opacity: 1, y: 0 }}
  //               exit={{ opacity: 0, y: -20 }}
  //               transition={{ duration: 0.2 }}
  //             >
  //               {isJsonContent ? (
  //                 <table className="min-w-full divide-y divide-gray-200">
  //                   <tbody className="divide-y divide-gray-200">
  //                     {(Array.isArray(parsedContent)
  //                       ? isExpanded
  //                         ? parsedContent
  //                         : parsedContent.slice(0, 5)
  //                       : Object.entries(parsedContent)
  //                     ).map((item, argIdx) => {
  //                       const [key, value] = Array.isArray(parsedContent)
  //                         ? [argIdx, item]
  //                         : [item[0], item[1]];
  //                       return (
  //                         <tr key={argIdx}>
  //                           <td className="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
  //                             {key}
  //                           </td>
  //                           <td className="px-4 py-2 text-sm text-gray-500">
  //                             {isComplexValue(value) ? (
  //                               <code className="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">
  //                                 {JSON.stringify(value, null, 2)}
  //                               </code>
  //                             ) : (
  //                               String(value)
  //                             )}
  //                           </td>
  //                         </tr>
  //                       );
  //                     })}
  //                   </tbody>
  //                 </table>
  //               ) : (
  //                 <code className="block text-sm">{displayedContent}</code>
  //               )}
  //             </motion.div>
  //           </AnimatePresence>
  //         </div>
  //         {((shouldTruncate && !isJsonContent) ||
  //           (isJsonContent &&
  //             Array.isArray(parsedContent) &&
  //             parsedContent.length > 5)) && (
  //           <motion.button
  //             onClick={() => setIsExpanded(!isExpanded)}
  //             className="flex w-full cursor-pointer items-center justify-center border-t-[1px] border-gray-200 py-2 text-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-600"
  //             initial={{ scale: 1 }}
  //             whileHover={{ scale: 1.02 }}
  //             whileTap={{ scale: 0.98 }}
  //           >
  //             {isExpanded ? <ChevronUp /> : <ChevronDown />}
  //           </motion.button>
  //         )}
  //       </motion.div>
  //     </div>
  //   </div>
  // );
  return (
    // ---- BẮT ĐẦU CHỈNH SỬA ----
    // Sắp xếp lại layout, giới hạn chiều rộng, căn giữa
    <div className="mx-auto w-full max-w-[80%] my-2">
      <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className={cn(
            "flex items-center justify-between px-3 py-1.5 text-sm",
            isSuccess ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
        )}>
          <div className="flex items-center gap-2 font-medium">
             {isSuccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
             <span>Tool Result{message.name ? `: ${message.name}` : ''}</span>
          </div>
            {message.tool_call_id && (
              <code className="rounded bg-background px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
                ID: {message.tool_call_id.slice(0, 8)}...
              </code>
            )}
        </div>
        {/* Nội dung có thể thu gọn */}
        <AnimatePresence initial={false}>
            {(isExpanded || !shouldTruncate) && (
                 <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden border-t border-border"
                >
                    <div className="bg-background p-3">
                        <pre className="whitespace-pre-wrap break-all font-mono text-xs text-foreground">
                            {contentStr}
                        </pre>
                    </div>
                 </motion.div>
            )}
        </AnimatePresence>
        {/* Nút View More/Less */}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center border-t border-border bg-muted/30 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
          >
            {isExpanded ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
     // ---- KẾT THÚC CHỈNH SỬA ----
  );
}
