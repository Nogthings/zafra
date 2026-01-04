"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Terminal as TerminalIcon } from "lucide-react"

export function Terminal() {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setStep((prev) => (prev < 3 ? prev + 1 : prev))
        }, 1500)

        return () => clearTimeout(timer)
    }, [step])

    return (
        <div className="w-full max-w-lg overflow-hidden rounded-xl border bg-zinc-950 text-zinc-50 shadow-xl dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2 rounded-md bg-zinc-800/50 px-2 py-1 text-xs text-zinc-400">
                    <TerminalIcon className="h-3 w-3" />
                    <span>bash</span>
                </div>
            </div>
            <div className="font-mono text-sm p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-green-500">➜</span>
                    <span className="text-zinc-400">~</span>
                    <span>git clone https://github.com/zafra/zafra.git</span>
                </div>
                {step >= 1 && (
                    <div className="text-zinc-500 pl-4">Cloning into 'zafra'...</div>
                )}

                {step >= 1 && (
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-zinc-400">~</span>
                        <span>cd zafra</span>
                    </div>
                )}

                {step >= 2 && (
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-blue-500">zafra</span>
                        <span className="text-zinc-500">git:(</span>
                        <span className="text-red-500">main</span>
                        <span className="text-zinc-500">)</span>
                        <span>bun install</span>
                    </div>
                )}

                {step >= 2 && (
                    <div className="text-zinc-500 pl-4">
                        <span className="text-green-500">✔</span> Dependencies installed
                    </div>
                )}

                {step >= 3 && (
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-blue-500">zafra</span>
                        <span className="text-zinc-500">git:(</span>
                        <span className="text-red-500">main</span>
                        <span className="text-zinc-500">)</span>
                        <span>bun dev</span>
                        <span className="animate-pulse block h-4 w-2 bg-zinc-500 ml-1" />
                    </div>
                )}
            </div>
        </div>
    )
}
