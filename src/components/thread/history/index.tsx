import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect } from "react";

import { getContentString } from "../utils";
import { useQueryState, parseAsBoolean } from "nuqs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// import { Skeleton } from "@/components/ui/skeleton";
// import { PanelRightOpen, PanelRightClose } from "lucide-react";
// import { useMediaQuery } from "@/hooks/useMediaQuery";

import { Skeleton } from "@/components/ui/skeleton";
// 
import { MessageSquareText, PanelRightOpen, PanelRightClose } from "lucide-react"; // Thay icon
// 
import { useMediaQuery } from "@/hooks/useMediaQuery";

function ThreadList({
  threads,
  onThreadClick,
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
}) {
  const [threadId, setThreadId] = useQueryState("threadId");

  return (
    // 
    // Thêm scrollbar-themed
    <div className="flex h-full w-full flex-col items-start justify-start gap-1 overflow-y-scroll scrollbar-themed pt-2">
    {/*  */}
    {/* <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"> */}
      {threads.map((t) => {
        let itemText = t.thread_id;
        if (
          typeof t.values === "object" &&
          t.values &&
          "messages" in t.values &&
          Array.isArray(t.values.messages) &&
          t.values.messages?.length > 0
        ) {
          const firstMessage = t.values.messages[0];
          itemText = getContentString(firstMessage.content);
        }
        return (
          <div
            key={t.thread_id}
            className="w-full px-1"
          >
            <Button
              // variant="ghost"
              // className="w-[280px] items-start justify-start text-left font-normal"
              // 
              variant={t.thread_id === threadId ? "secondary" : "ghost"} // Highlight thread đang chọn
              className="w-full h-auto min-h-[40px] items-center justify-start text-left font-normal px-2 py-1.5" // Style giống ChatGPT
              // 
              onClick={(e) => {
                e.preventDefault();
                onThreadClick?.(t.thread_id);
                if (t.thread_id === threadId) return;
                setThreadId(t.thread_id);
              }}
            >
              {/* <p className="truncate text-ellipsis">{itemText}</p> */}
              {/*  */}
              <MessageSquareText className="h-4 w-4 mr-2 flex-shrink-0" /> {/* Thêm icon */}
              <p className="truncate text-ellipsis text-sm">{itemText || "New Chat"}</p> {/* Font nhỏ hơn, fallback */}
               {/*  */}
            </Button>
          </div>
        );
      })}
    </div>
  );
}


function ThreadHistoryLoading() {
  return (
    // 
    <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-hidden px-1 pt-2">
    {/*  */}
      {Array.from({ length: 15 }).map((_, i) => ( // Giảm số lượng skeleton
        <Skeleton
          key={`skeleton-${i}`}
           // 
          className="h-10 w-full" // Style skeleton
          // 
        />
      ))}
    </div>
  );
}

export default function ThreadHistory() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } =
    useThreads();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
  }, []);

  // 
  // Tự động đóng sidebar trên màn hình nhỏ sau khi chọn thread
  const handleThreadClick = (threadId: string) => {
    if (!isLargeScreen) {
      setChatHistoryOpen(false);
    }
     // Logic setThreadId đã có trong component ThreadList
  };
  // 


  return (
    <>
      <div className="shadow-inner-right hidden h-screen w-[300px] shrink-0 flex-col items-start justify-start gap-0 border-r-[1px] border-border bg-sidebar text-sidebar-foreground lg:flex"> {/* Đổi border, background, text color */}
         {/*  */}
        <div className="flex w-full items-center justify-between border-b border-sidebar-border px-2 pt-2 pb-2"> {/* Giảm padding, đổi border */}
          <h1 className="text-base font-semibold tracking-tight px-2"> {/* Giảm font size */}
             Chat History
          </h1>
           <Button
            className="hover:bg-sidebar-accent" // Màu hover mới
            variant="ghost"
            size="icon" // Dùng size icon
            onClick={() => setChatHistoryOpen((p) => !p)}
           >
             <PanelRightClose className="size-5" /> {/* Chỉ cần nút đóng */}
           </Button>
        </div>
        {/*  */}
        {threadsLoading ? (
          <ThreadHistoryLoading />
        ) : (
           // 
          <ThreadList threads={threads} onThreadClick={handleThreadClick} />
          // 
        )}
      </div>
       {/* Sheet cho màn hình nhỏ */}
      <div className="lg:hidden">
        <Sheet
          open={!!chatHistoryOpen && !isLargeScreen}
          onOpenChange={(open) => {
            if (isLargeScreen) return;
            setChatHistoryOpen(open);
          }}
        >
          <SheetContent
             // 
            side="left"
            className="flex flex-col p-0 lg:hidden w-[300px] bg-sidebar text-sidebar-foreground border-sidebar-border" // Style cho sheet
             // 
          >
            {/*  */}
            <SheetHeader className="border-b border-sidebar-border p-4 pt-3 pb-3"> {/* Giảm padding */}
              <SheetTitle className="text-base">Chat History</SheetTitle> {/* Giảm font size */}
            </SheetHeader>
            {threadsLoading ? (
                <ThreadHistoryLoading />
            ) : (
                <ThreadList threads={threads} onThreadClick={handleThreadClick} />
            )}
             {/*  */}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
