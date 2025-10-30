import { PrismAsyncLight as SyntaxHighlighterPrism } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FC } from "react";

// ---- BẮT ĐẦU CHỈNH SỬA ----
// Sử dụng theme giống VS Code dark
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
// ---- KẾT THÚC CHỈNH SỬA ----

// Register languages you want to support
SyntaxHighlighterPrism.registerLanguage("js", tsx);
SyntaxHighlighterPrism.registerLanguage("jsx", tsx);
SyntaxHighlighterPrism.registerLanguage("ts", tsx);
SyntaxHighlighterPrism.registerLanguage("tsx", tsx);
SyntaxHighlighterPrism.registerLanguage("python", python);

interface SyntaxHighlighterProps {
  children: string;
  language: string;
  className?: string;
}

// export const SyntaxHighlighter: FC<SyntaxHighlighterProps> = ({
//   children,
//   language,
//   className,
// }) => {
//   return (
//     <SyntaxHighlighterPrism
//       language={language}
//       style={coldarkDark}
//       customStyle={{
//         margin: 0,
//         width: "100%",
//         background: "transparent",
//         padding: "1.5rem 1rem",
//       }}
//       className={className}
//     >
//       {children}
//     </SyntaxHighlighterPrism>
//   );
// };


export const SyntaxHighlighter: FC<SyntaxHighlighterProps> = ({
  children,
  language,
  className,
}) => {
  return (
    <SyntaxHighlighterPrism
      language={language}
      // ---- BẮT ĐẦU CHỈNH SỬA ----
      style={vscDarkPlus} // Sử dụng theme vscDarkPlus
      customStyle={{
        margin: 0,
        width: "100%",
        background: "transparent", // Nền đã được đặt ở thẻ <pre> bên ngoài
        padding: "1rem", // Điều chỉnh padding
        fontSize: '0.875rem', // Giống font-size của text thường
        lineHeight: '1.5rem', // Tăng line height
      }}
      codeTagProps={{
        style: {
          fontFamily: "var(--font-mono)", // Đảm bảo dùng font mono
        }
      }}
      // ---- KẾT THÚC CHỈNH SỬA ----
      className={className}
    >
      {children}
    </SyntaxHighlighterPrism>
  );
};