// 
import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 
// Thêm icon Wrench (công cụ)
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Wrench } from "lucide-react";
// 
import { cn } from "@/lib/utils"; // Import cn

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

/**
 * Rút gọn ID tool call để hiển thị
 * @param id ID gốc
 * @param startLength Số ký tự đầu
 * @param endLength Số ký tự cuối
 * @returns ID đã rút gọn (ví dụ: "tool_...xyz")
 */
function truncateToolCallId(id: string, startLength = 5, endLength = 3): string {
  if (id.length <= startLength + endLength + 3) {
    return id;
  }
  return `${id.slice(0, startLength)}...${id.slice(-endLength)}`;
}

// Component con để render Tool Call riêng lẻ, có thể thu gọn
function SingleToolCall({ toolCall }: { toolCall: NonNullable<AIMessage["tool_calls"]>[number] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const args = toolCall.args as Record<string, any> || {};
  const argString = JSON.stringify(args, null, 2);
  // Kiểm tra xem args có rỗng không
  const hasArgs = Object.keys(args).length > 0;
  const toolCallId = toolCall.id ? truncateToolCallId(toolCall.id) : null;

  // Kiểm tra xem có cần nút "Show More" không (dựa trên 3 dòng)
  const maxLinesCollapsed = 3;
  const maxLengthCollapsed = 150; // Ước tính số ký tự
  // Chỉ hiển thị "Show More" nếu có nội dung args
  const shouldTruncate = hasArgs && (argString.length > maxLengthCollapsed || argString.split('\n').length > maxLinesCollapsed);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Header: Tên tool (trái) và ID (phải) */}
      <div
        className="flex w-full items-center justify-between bg-muted/30 px-3 py-2 text-left text-sm"
      >
        <span className="flex items-center gap-2 font-medium text-foreground">
          {/*  */}
          <Wrench className="h-4 w-4 text-muted-foreground" />
          {/* Hiển thị tên tool bằng font code */}
          <code className="font-medium">{toolCall.name}</code>
          {/*  */}
        </span>
        <span className="flex items-center gap-2">
           {toolCallId && (
             <code className="rounded bg-background px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
               {toolCallId}
             </code>
           )}
        </span>
      </div>
      
      {/* Nội dung có thể thu gọn - chỉ render nếu có args */}
      {hasArgs && (
        <div className="bg-background/50">
          {/*  */}
          {/* ĐÃ XÓA NHÃN "Arguments" */}
          {/*  */}
          <motion.pre
            className="whitespace-pre-wrap break-all font-mono text-xs text-foreground px-3 py-2 overflow-hidden" // Thêm padding
            initial={false}
            animate={{ 
              maxHeight: isExpanded ? '500px' : '4.5rem' // 1.5rem * 3 lines
            }}
            style={{
              // Áp dụng line-clamp khi không mở rộng
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: isExpanded ? 'none' : 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: isExpanded ? '500px' : '4.5rem' // Đảm bảo maxHeight khớp
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {argString}
          </motion.pre>
        </div>
      )}

      {/* Nút View More/Less */}
      {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full cursor-pointer items-center justify-center border-t border-border bg-muted/30 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/60"
          >
            {isExpanded ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
    </div>
  );
}


export function ToolCalls({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    // 
    // Căn giữa, giới hạn chiều rộng
    <div className="mx-auto w-[80%] md:w-[75%] flex flex-col gap-2">
      {/* ĐÃ XÓA NHÃN "Tool Calls" */}
    {/*  */}
      {toolCalls.map((tc, idx) => (
         <SingleToolCall key={tc.id || `toolcall-${idx}`} toolCall={tc} />
      ))}
    </div>
  );
}

export function ToolResult({ message }: { message: ToolMessage }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let parsedContent: any;
  let isJsonContent = false;
  let contentStr = "";
  let hasContent = false;

  try {
    if (typeof message.content === "string") {
      // Kiểm tra nếu content chỉ là 'null' hoặc rỗng
      if (message.content.trim() === 'null' || message.content.trim() === '') {
         hasContent = false;
         contentStr = "null"; // Hiển thị "null" nếu tool không trả về gì
      } else {
         parsedContent = JSON.parse(message.content);
         isJsonContent = isComplexValue(parsedContent);
         contentStr = JSON.stringify(parsedContent, null, 2);
         hasContent = true;
      }
    } else if (message.content) {
       // Xử lý trường hợp content là object (mặc dù type là string)
       parsedContent = message.content;
       isJsonContent = isComplexValue(parsedContent);
       contentStr = JSON.stringify(parsedContent, null, 2);
       hasContent = true;
    } else {
        hasContent = false;
        contentStr = "null";
    }
  } catch {
    // Content không phải JSON, sử dụng trực tiếp
    parsedContent = message.content;
    contentStr = String(message.content);
    hasContent = contentStr.trim().length > 0 && contentStr.trim() !== 'null';
  }

  // Giả sử có trạng thái thành công/thất bại (cần logic thực tế)
  const isSuccess = true; // Placeholder
  
  const toolCallId = message.tool_call_id ? truncateToolCallId(message.tool_call_id) : null;

  // Kiểm tra xem có cần nút "Show More" không (dựa trên 4 dòng)
  const maxLinesCollapsed = 4;
  const maxLengthCollapsed = 200;
  const shouldTruncate = hasContent && (contentStr.length > maxLengthCollapsed || contentStr.split('\n').length > maxLinesCollapsed);

  return (
    // 
    // Căn giữa, giới hạn chiều rộng
    <div className="mx-auto w-[80%] md:w-[75%]">
    {/*  */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {/* Header với trạng thái, tên, ID */}
        <div className={cn(
            "flex items-center justify-between px-3 py-2 text-sm",
            isSuccess ? "bg-muted/30" : "bg-red-100 dark:bg-red-900/30"
        )}>
          <div className="flex items-center gap-2 font-medium text-foreground">
             {isSuccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
             <span>Tool Result{message.name ? `: ${message.name}` : ''}</span>
          </div>
            {toolCallId && (
              <code className="rounded bg-background px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
                {toolCallId}
              </code>
            )}
        </div>
        
        {/* Nội dung có thể thu gọn - chỉ render nếu có content */}
        {hasContent && (
          <div className="bg-background/50">
            {/*  */}
            {/* ĐÃ XÓA NHÃN "Result" */}
            {/*  */}
            <motion.pre
              className="whitespace-pre-wrap break-all font-mono text-xs text-foreground px-3 py-2 overflow-hidden" // Thêm padding
              initial={false}
              animate={{ 
                maxHeight: isExpanded ? '500px' : '6rem' // 1.5rem * 4 lines
              }}
              style={{
                // Áp dụng line-clamp khi không mở rộng
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: isExpanded ? 'none' : 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: isExpanded ? '500px' : '6rem' // Đảm bảo maxHeight khớp
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              {contentStr}
            </motion.pre>
          </div>
        )}
        
        {/* Nút View More/Less */}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full cursor-pointer items-center justify-center border-t border-border bg-muted/30 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/60"
          >
            {isExpanded ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
// 