// ---- START MODIFY ----
"use client";

import "./markdown-styles.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { FC, memo, useState } from "react";
// import { CheckIcon, CopyIcon } from "lucide-react";
import { SyntaxHighlighter } from "@/components/thread/syntax-highlighter";

// import { TooltipIconButton } from "@/components/thread/tooltip-icon-button"; // Không dùng nữa
import { cn } from "@/lib/utils";

import "katex/dist/katex.min.css";

// Import thêm icon Moon và Sun
import { useTheme } from "next-themes"; // Import useTheme
import { CheckIcon, CopyIcon, Moon, Sun } from "lucide-react";


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

//   const { theme } = useTheme(); // Lấy theme hiện tại
  
//   const onCopy = () => {
//     if (!code || isCopied) return;
//     copyToClipboard(code);
//   };

//   return (
  
//     // Thay đổi background và text color dựa trên theme
//     <div className={cn(
//         "flex items-center justify-between gap-4 rounded-t-md px-4 py-1.5 text-xs",
//         theme === 'dark' ? "bg-black text-gray-400" : "bg-gray-800 text-gray-300"
//     )}>
//       <span className="font-sans">{language}</span>
//     {/* Thay TooltipIconButton bằng Button thường có text */}
//       <button
//         onClick={onCopy}
//         className={cn(
//           "flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-sans", // Thêm class mới
//           theme === 'dark' ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100 cursor-pointer" : "text-gray-300 hover:bg-gray-600 hover:text-gray-100 cursor-pointer"
//         )}
//       >
//         {!isCopied && <CopyIcon className="h-4 w-4" />}
//         {isCopied && <CheckIcon className="h-4 w-4 text-green-500" />}
//         <span>{isCopied ? "Copied" : "Copy"}</span>
//       </button>
//     </div>
//   );
// };

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const { theme } = useTheme();
  
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    // ---- CHANGE 1: Bỏ bo góc (rounded-t-md) vì component cha sẽ xử lý ----
    <div className={cn(
        "flex items-center justify-between gap-4 px-4 py-1.5 text-xs",
        theme === 'dark' ? "bg-black text-gray-400" : "bg-gray-800 text-gray-300"
    )}>
      <span className="font-sans">{language}</span>
      <button
        onClick={onCopy}
        className={cn(
          "flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-sans cursor-pointer",
          theme === 'dark' ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100" : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
        )}
      >
        {!isCopied && <CopyIcon className="h-4 w-4" />}
        {isCopied && <CheckIcon className="h-4 w-4 text-green-500" />}
        <span>{isCopied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};



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
  // pre: ({ className, children, ...props }: { className?: string, children: React.ReactNode }) => {
  //    // Apply dark background for code blocks regardless of theme for contrast
  //    // Apply dark background for code blocks regardless of theme for contrast, remove rounded-lg for header integration
  //   return (
  //     <pre
  //       className={cn("!p-0 mb-4 mt-6 overflow-x-auto rounded-b-md bg-gray-900 py-4 font-mono text-sm", className)}
  //       {...props}
  //     >
  //       {children}
  //     </pre>
  //   )
  // },

  // ---- CHANGE 2: Biến thẻ <pre> thành container chính ----
  pre: ({ className, children, ...props }: { className?: string, children: React.ReactNode }) => {
    return (
      // Dùng <div> thay <pre> để làm container
      // Thêm border, bo tròn 4 góc (rounded-md), và overflow-hidden
      <div
        className={cn(
          "my-6 overflow-hidden rounded-md border border-gray-700 bg-gray-900",
          className
        )}
      >
        {children}
      </div>
    )
  },


  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children: React.ReactNode;
    inline?: boolean;
  }) => {
    const match = /language-(\w+)/.exec(className || "");

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
    
    if (match) {
      const language = match[1];
      const code = String(children).replace(/\n$/, "");

      return (
        <>
          <CodeHeader
            language={language}
            code={code}
          />
          {/* ---- CHANGE 3: Thêm padding và scroll cho vùng code ---- */}
          <div className="overflow-x-auto p-0 font-mono text-sm">
            <SyntaxHighlighter language={language}>
              {code}
            </SyntaxHighlighter>
          </div>
        </>
      );
    }

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


const MarkdownTextImpl: FC<{ children: string }> = ({ children }) => {
  return (
  
    // Thêm class để CSS targeting nếu cần
    <div className="markdown-content prose dark:prose-invert prose-sm sm:prose-base max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none">
    {/* */}
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
// ---- END MODIFY ----