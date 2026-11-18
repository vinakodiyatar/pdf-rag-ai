
'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, FileText, Bot, User, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents: string[];
}

const ChatComponent: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSendChatQuery = async () => {
        if (!message.trim() || loading) return;

        const queryText = message.trim();
        setMessage('');

        setMessages((prev) => [
            ...prev,
            { role: 'user', content: queryText, documents: [] }
        ]);

        setLoading(true);

        try {
            const res = await fetch(
                `${API_BASE_URL}/chat?question=${encodeURIComponent(queryText)}`,
                { method: 'GET' }
            );

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.data?.message || data.error || 'No response received',
                    documents: data.docs
                        ? data.docs.map((d: any) => d.pageContent || JSON.stringify(d))
                        : []
                }
            ]);
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Error: ${err.message}`,
                    documents: []
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-background">

            {/* Header */}
            <header className="border-b px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                        <h1 className="font-semibold text-base">
                            DocuQuery
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            AI-powered PDF assistant
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-7">

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center pt-24">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                                <Bot className="h-8 w-8 text-primary" />
                            </div>

                            <h2 className="text-xl font-semibold mb-2">
                                Ask your documents anything
                            </h2>

                            <p className="text-sm text-muted-foreground max-w-sm">
                                Ask questions about your uploaded PDF files
                                and get AI-powered answers based on their content.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                                {[
                                    "Summarize this document",
                                    "What are the key points?",
                                    "Explain the main concepts",
                                    "Find important information"
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setMessage(suggestion)}
                                        className="text-sm text-left border rounded-xl p-3 hover:bg-muted transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${
                                    m.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                {m.role === 'assistant' && (
                                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                )}

                                <div className={`max-w-[85%] ${
                                    m.role === 'user' ? 'order-first' : ''
                                }`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                                            m.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                : 'bg-muted/70 text-foreground rounded-tl-sm'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">
                                            {m.content}
                                        </p>
                                    </div>

                                    {m.documents.length > 0 && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                            <FileText className="h-3.5 w-3.5" />
                                            Referenced {m.documents.length} PDF context chunks
                                        </div>
                                    )}
                                </div>

                                {m.role === 'user' && (
                                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {loading && (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing your documents...
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Input Area */}
            <footer className="border-t bg-background px-4 py-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 border rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Input
                            className="border-0 shadow-none focus-visible:ring-0 text-sm"
                            placeholder="Ask something about your PDFs..."
                            value={message}
                            disabled={loading}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendChatQuery();
                                }
                            }}
                        />

                        <Button
                            size="icon"
                            className="rounded-xl shrink-0"
                            onClick={handleSendChatQuery}
                            disabled={!message.trim() || loading}
                        >
                            {loading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Send className="h-4 w-4" />
                            }
                        </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mt-3">
                        AI can make mistakes. Verify important information with your source documents.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default ChatComponent;
