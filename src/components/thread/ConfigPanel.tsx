// ---- START MODIFY ----
// import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, X } from 'lucide-react';
import { useStreamContext } from '@/providers/Stream';
import { StateViewObject } from './agent-inbox/components/state-view'; // Tái sử dụng StateViewObject
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface ConfigPanelProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isPersistent?: boolean; // Thêm prop mới
}

// Tách nội dung panel ra component riêng để tái sử dụng
const ConfigPanelContent = ({ onOpenChange, isPersistent }: { onOpenChange: (open: boolean) => void, isPersistent?: boolean }) => {
    const { values } = useStreamContext();
    const [expandedState, setExpandedState] = useState(false);

    // Lấy messages từ state, loại bỏ UI messages nếu có
    const messagesToDisplay = values?.messages || [];

    // Placeholder cho model config - bạn cần lấy dữ liệu thực tế
    const modelConfig = {
        modelName: "gpt-4o",
        temperature: 0.7,
        maxTokens: 1024,
    };

    return (
        <>
            <SheetHeader className={cn(
                "p-4 border-b",
                isPersistent && "flex flex-row items-center justify-between" // Style cho header persistent
            )}>
                {/* ---- FIX: Sử dụng text-foreground (sẽ tự đổi màu) ---- */}
                {isPersistent ? (
                    <h3 className="text-base font-semibold text-foreground">Configuration & State</h3>
                ) : (
                    <SheetTitle className="text-base font-semibold">Configuration & State</SheetTitle>
                )}
                {/* ----------------- END FIX ----------------- */}

                {/* Nút đóng thủ công cho panel persistent */}
                {isPersistent && (
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-muted-foreground">
                        <X className="h-4 w-4" />
                    </Button>
                )}
                {/* Nút đóng của SheetContent sẽ tự xử lý khi không persistent */}
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-themed">
                {/* Phần Model Config (Placeholder) */}
                <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Model Configuration</h3>
                        {/* ---- FIX: Thêm text-foreground cho div cha và text-muted-foreground cho span nhãn ---- */}
                        <div className="text-xs space-y-1 text-foreground">
                            <p><span className="font-medium text-muted-foreground">Model:</span> {modelConfig.modelName}</p>
                            <p><span className="font-medium text-muted-foreground">Temperature:</span> {modelConfig.temperature}</p>
                            <p><span className="font-medium text-muted-foreground">Max Tokens:</span> {modelConfig.maxTokens}</p>
                            {/* ----------------- END FIX ----------------- */}
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2 text-xs" disabled> {/* Nút này chỉ là UI */}
                        Change Model (Not Implemented)
                        </Button>
                </div>

                <Separator />

                    {/* Phần State */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Current State ('messages')</h3>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedState(!expandedState)} className="text-xs h-6 px-1">
                            {expandedState ? 'Collapse' : 'Expand'} All
                        </Button>
                    </div>
                    {messagesToDisplay.length > 0 ? (
                        <div className="rounded-md border bg-card p-3 max-h-[400px] overflow-y-auto scrollbar-themed">
                            {/* Sử dụng StateViewObject để hiển thị messages */}
                            <StateViewObject keyName="messages" value={messagesToDisplay} expanded={expandedState} />
                            {/* Bạn có thể lặp qua các key khác trong `values` nếu muốn hiển thị thêm */}
                            {/* {Object.entries(values || {}).filter(([k]) => k !== 'messages' && k !== 'ui').map(([key, value]) => (
                                <StateViewObject key={key} keyName={key} value={value} expanded={expandedState} />
                            ))} */}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No messages in state yet.</p>
                    )}
                </div>
            </div>
        </>
    );
}


export function ConfigPanel({ isOpen, onOpenChange, isPersistent = false }: ConfigPanelProps) {

    if (isPersistent) {
        // Render dưới dạng div cố định (dành cho panel bên phải)
        return (
            <div className="flex flex-col h-full w-full bg-sidebar text-sidebar-foreground">
                <ConfigPanelContent onOpenChange={onOpenChange} isPersistent={true} />
            </div>
        );
    }

    // Render dưới dạng Sheet (modal) như cũ
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            {/* Không cần SheetTrigger ở đây, nút toggle sẽ ở component cha */}
            <SheetContent side="right" className="w-[350px] sm:w-[400px] p-0 flex flex-col scrollbar-themed">
                 <ConfigPanelContent onOpenChange={onOpenChange} isPersistent={false} />
            </SheetContent>
        </Sheet>
    );
}
// ---- END MODIFY ----