// 
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
}

export function ConfigPanel({ isOpen, onOpenChange }: ConfigPanelProps) {
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
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            {/* Không cần SheetTrigger ở đây, nút toggle sẽ ở component cha */}
            <SheetContent side="right" className="w-[350px] sm:w-[400px] p-0 flex flex-col scrollbar-themed">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-base font-semibold">Configuration & State</SheetTitle>
                    {/* Nút đóng được SheetContent tự xử lý */}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-themed">
                    {/* Phần Model Config (Placeholder) */}
                    <div className="space-y-2">
                         <h3 className="text-sm font-medium text-muted-foreground">Model Configuration</h3>
                         <div className="text-xs space-y-1">
                             <p><span className="font-medium">Model:</span> {modelConfig.modelName}</p>
                             <p><span className="font-medium">Temperature:</span> {modelConfig.temperature}</p>
                             <p><span className="font-medium">Max Tokens:</span> {modelConfig.maxTokens}</p>
                             {/* Thêm các config khác nếu có */}
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
            </SheetContent>
        </Sheet>
    );
}