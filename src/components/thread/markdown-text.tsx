"use client";

import "./markdown-styles.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { FC, memo, useState } from "react";
// import { CheckIcon, CopyIcon } from "lucide-react";
import { SyntaxHighlighter } from "@/components/thread/syntax-highlighter";

import { TooltipIconButton } from "@/components/thread/tooltip-icon-button";
import { cn } from "@/lib/utils";

import "katex/dist/katex.min.css";

// ---- BẮT ĐẦU CHỈNH SỬA ----
// Import thêm icon Moon và Sun
import { useTheme } from "next-themes"; // Import useTheme
import { CheckIcon, CopyIcon, Moon, Sun } from "lucide-react";
// ---- KẾT THÚC CHỈNH SỬA ----

interface CodeHeaderProps {
  language?: string;
  code: string;
}

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

// const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
//   const { isCopied, copyToClipboard } = useCopyToClipboard();
//   const onCopy = () => {
//     if (!code || isCopied) return;
//     copyToClipboard(code);
//   };

//   return (
//     <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
//       <span className="lowercase [&>span]:text-xs">{language}</span>
//       <TooltipIconButton
//         tooltip="Copy"
//         onClick={onCopy}
//       >
//         {!isCopied && <CopyIcon />}
//         {isCopied && <CheckIcon />}
//       </TooltipIconButton>
//     </div>
//   );
// };

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  // ---- BẮT ĐẦU CHỈNH SỬA ----
  const { theme } = useTheme(); // Lấy theme hiện tại
  // ---- KẾT THÚC CHỈNH SỬA ----
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    // ---- BẮT ĐẦU CHỈNH SỬA ----
    // Thay đổi background và text color dựa trên theme
    <div className={cn(
        "flex items-center justify-between gap-4 rounded-t-md px-4 py-1.5 text-xs",
        theme === 'dark' ? "bg-black text-gray-400" : "bg-gray-800 text-gray-300"
    )}>
      <span className="font-sans">{language}</span>
    {/* ---- KẾT THÚC CHỈNH SỬA ---- */}
      <TooltipIconButton
        tooltip="Copy code"
        onClick={onCopy}
        // ---- BẮT ĐẦU CHỈNH SỬA ----
        className={cn(
          "h-6 w-6 p-1",
          theme === 'dark' ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100" : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
        )}
        // ---- KẾT THÚC CHỈNH SỬA ----
      >
        {!isCopied && <CopyIcon className="h-4 w-4" />}
        {isCopied && <CheckIcon className="h-4 w-4 text-green-500" />}
      </TooltipIconButton>
    </div>
  );
};

// const defaultComponents: any = {
//   h1: ({ className, ...props }: { className?: string }) => (
//     <h1
//       className={cn(
//         "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   h2: ({ className, ...props }: { className?: string }) => (
//     <h2
//       className={cn(
//         "mt-8 mb-4 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   h3: ({ className, ...props }: { className?: string }) => (
//     <h3
//       className={cn(
//         "mt-6 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   h4: ({ className, ...props }: { className?: string }) => (
//     <h4
//       className={cn(
//         "mt-6 mb-4 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   h5: ({ className, ...props }: { className?: string }) => (
//     <h5
//       className={cn(
//         "my-4 text-lg font-semibold first:mt-0 last:mb-0",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   h6: ({ className, ...props }: { className?: string }) => (
//     <h6
//       className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)}
//       {...props}
//     />
//   ),
//   p: ({ className, ...props }: { className?: string }) => (
//     <p
//       className={cn("mt-5 mb-5 leading-7 first:mt-0 last:mb-0", className)}
//       {...props}
//     />
//   ),
//   a: ({ className, ...props }: { className?: string }) => (
//     <a
//       className={cn(
//         "text-primary font-medium underline underline-offset-4",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   blockquote: ({ className, ...props }: { className?: string }) => (
//     <blockquote
//       className={cn("border-l-2 pl-6 italic", className)}
//       {...props}
//     />
//   ),
//   ul: ({ className, ...props }: { className?: string }) => (
//     <ul
//       className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
//       {...props}
//     />
//   ),
//   ol: ({ className, ...props }: { className?: string }) => (
//     <ol
//       className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
//       {...props}
//     />
//   ),
//   hr: ({ className, ...props }: { className?: string }) => (
//     <hr
//       className={cn("my-5 border-b", className)}
//       {...props}
//     />
//   ),
//   table: ({ className, ...props }: { className?: string }) => (
//     <table
//       className={cn(
//         "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   th: ({ className, ...props }: { className?: string }) => (
//     <th
//       className={cn(
//         "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   td: ({ className, ...props }: { className?: string }) => (
//     <td
//       className={cn(
//         "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   tr: ({ className, ...props }: { className?: string }) => (
//     <tr
//       className={cn(
//         "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
//         className,
//       )}
//       {...props}
//     />
//   ),
//   sup: ({ className, ...props }: { className?: string }) => (
//     <sup
//       className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
//       {...props}
//     />
//   ),
//   pre: ({ className, ...props }: { className?: string }) => (
//     <pre
//       className={cn(
//         "max-w-4xl overflow-x-auto rounded-lg bg-black text-white",
//         className,
//       )}
//       style={{
//         padding: "16px 16px 12px 12px",
//         margin: "8px 0px",
//         color: "#f1f1f1ff",
//         background: "#111113"
//       }}
//       {...props}
//     />
//   ),
//   code: ({
//     className,
//     children,
//     ...props
//   }: {
//     className?: string;
//     children: React.ReactNode;
//   }) => {
//     const match = /language-(\w+)/.exec(className || "");

//     if (match) {
//       const language = match[1];
//       const code = String(children).replace(/\n$/, "");

//       return (
//         <>
//           <CodeHeader
//             language={language}
//             code={code}
//           />
//           <SyntaxHighlighter
//             language={language}
//             className={className}
//           >
//             {code}
//           </SyntaxHighlighter>
//         </>
//       );
//     }

//     return (
//       <code
//         className={cn("rounded font-semibold", className)}
//         {...props}
//       >
//         {children}
//       </code>
//     );
//   },
// };


// ---- BẮT ĐẦU CHỈNH SỬA ----
// Cập nhật các component style mặc định cho giống ChatGPT hơn
const defaultComponents: any = {
  h1: ({ className, ...props }: { className?: string }) => (
    <h1
      className={cn(
        "mt-6 mb-4 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: { className?: string }) => (
    <h2
      className={cn(
        "mt-8 mb-4 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: { className?: string }) => (
    <h3
      className={cn(
        "mt-6 mb-4 text-xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: { className?: string }) => (
    <h4
      className={cn(
        "mt-6 mb-4 text-lg font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
   p: ({ className, ...props }: { className?: string }) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: { className?: string }) => (
    <a
      className={cn(
        "font-medium text-primary underline underline-offset-4 hover:text-primary/90",
        className,
      )}
      target="_blank" // Mở link ở tab mới
      rel="noopener noreferrer" // Thêm bảo mật
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: { className?: string }) => (
    <blockquote
      className={cn("mt-4 border-l-2 pl-6 italic text-muted-foreground", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: { className?: string }) => (
    <ul
      className={cn("my-4 ml-6 list-disc [&>li]:mt-1", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: { className?: string }) => (
    <ol
      className={cn("my-4 ml-6 list-decimal [&>li]:mt-1", className)}
      {...props}
    />
  ),
   hr: ({ className, ...props }: { className?: string }) => (
    <hr
      className={cn("my-4 md:my-6 border-border", className)}
      {...props}
    />
  ),
  table: ({ className, ...props }: { className?: string }) => (
    <div className="my-4 w-full overflow-y-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  ),
  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
  ),
  th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className={cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...props} />
  ),
  td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...props} />
  ),
  pre: ({ className, children, ...props }: { className?: string, children: React.ReactNode }) => {
     // Apply dark background for code blocks regardless of theme for contrast
     // Apply dark background for code blocks regardless of theme for contrast, remove rounded-lg for header integration
    return (
      <pre
        className={cn("mb-4 mt-6 overflow-x-auto rounded-b-md bg-gray-900 py-4 font-mono text-sm", className)}
        {...props}
      >
        {children}
      </pre>
    )
  },
  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children: React.ReactNode;
    // ---- BẮT ĐẦU CHỈNH SỬA ----
    // Thêm node để xử lý inline code styling
    inline?: boolean;
    // ---- KẾT THÚC CHỈNH SỬA ----
  }) => {
    const match = /language-(\w+)/.exec(className || "");

    // ---- BẮT ĐẦU CHỈNH SỬA ----
    // Điều chỉnh logic để xử lý inline code riêng
    if (props.inline) {
       return (
        <code
          className={cn(
              "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
              className
            )}
            {...props}
        >
          {children}
        </code>
      );
    }
    // ---- KẾT THÚC CHỈNH SỬA ----

    if (match) {
      const language = match[1];
      const code = String(children).replace(/\n$/, "");

      return (
        // ---- BẮT ĐẦU CHỈNH SỬA ----
        // Sử dụng Fragment để nhóm Header và SyntaxHighlighter
        // Remove pre wrapper here as it's handled by the 'pre' component override
        <>
          <CodeHeader
            language={language}
            code={code}
          />
          <SyntaxHighlighter
            language={language}
            // Loại bỏ className mặc định có thể gây xung đột
            className=""
          >
            {code}
          </SyntaxHighlighter>
        </>
        // ---- KẾT THÚC CHỈNH SỬA ----
      );
    }

    // Fallback cho code không có language match (sẽ không nên xảy ra nếu pre xử lý đúng)
    return (
      <code
        className={cn("rounded font-semibold", className)}
        {...props}
      >
        {children}
      </code>
    );
  },
};
// ---- KẾT THÚC CHỈNH SỬA ----

// const MarkdownTextImpl: FC<{ children: string }> = ({ children }) => {
//   return (
//     <div className="markdown-content">
//       <ReactMarkdown
//         remarkPlugins={[remarkGfm, remarkMath]}
//         rehypePlugins={[rehypeKatex]}
//         components={defaultComponents}
//       >
//         {children}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export const MarkdownText = memo(MarkdownTextImpl);


const MarkdownTextImpl: FC<{ children: string }> = ({ children }) => {
  return (
    // ---- BẮT ĐẦU CHỈNH SỬA ----
    // Thêm class để CSS targeting nếu cần
    <div className="markdown-content prose dark:prose-invert prose-sm sm:prose-base max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none">
    {/* ---- KẾT THÚC CHỈNH SỬA ---- */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={defaultComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const MarkdownText = memo(MarkdownTextImpl);
