'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Send, Paperclip, Bot, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
    id: string
    text: string
    sender: 'user' | 'bot'
    file?: {
        type: 'image' | 'audio' | 'video'
        url: string
        caption?: string
    }
}

export default function EnhancedChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isTyping, setIsTyping] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const popupTimer = setTimeout(() => setShowPopup(true), 3000)
        return () => clearTimeout(popupTimer)
    }, [])

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = () => {
        if (inputMessage.trim() || file) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputMessage,
                sender: 'user',
            }

            if (file) {
                newMessage.file = {
                    type: file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : 'video',
                    url: URL.createObjectURL(file),
                }
            }

            setMessages((prevMessages) => [...prevMessages, newMessage])
            setInputMessage('')
            setFile(null)

            setIsTyping(true)
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Thank you for your message. How can I assist you further?",
                    sender: 'bot',
                }
                setMessages((prevMessages) => [...prevMessages, botResponse])
                setIsTyping(false)
            }, 1500)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.size <= 25 * 1024 * 1024) {
            setFile(selectedFile)
        } else {
            alert('File size must be 25MB or less')
        }
    }

    return (
        <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-8 right-8 z-50 "
            >
                <Button
                    className="rounded-full p-10 shadow-lg bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary hover:bg-primary/90 dark:hover:bg-primary-foreground/90"
                    onClick={() => {
                        setIsOpen(!isOpen)
                        setShowPopup(false)
                    }}
                >
                    {isOpen ? <X className="w-9 h-9 dark:text-white" /> : <Bot className="w-9 h-9 dark:text-white" />}
                </Button>
                <AnimatePresence>
                    {showPopup && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className="absolute bottom-16 right-0 bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary p-3 rounded-lg shadow-lg"
                        >
                            <p className="text-sm font-medium dark:text-white">Hey! Need help?</p>
                            <ChevronRight className="dark:text-white absolute bottom-[-8px] right-4 text-primary dark:text-primary-foreground" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`fixed ${isExpanded ? 'inset-4' : 'bottom-36 right-4 w-80 h-[32rem]'} shadow-2xl z-40 overflow-hidden rounded-2xl`}
                    >
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg flex flex-col">
                            <div className="flex items-center justify-between p-4 bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary">
                                <div className="flex items-center space-x-2">
                                    <Avatar>
                                        <AvatarImage src="/avatar.png" alt="AI Assistant" />
                                        <AvatarFallback><Bot className='dark:text-white rounded-full' /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-white">AI Assistant</h3>
                                        <p className="text-xs opacity-70 text-white">Always here to help</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-primary-foreground dark:text-primary hover:bg-primary-foreground/10 dark:hover:bg-primary/10"
                                    >
                                        {isExpanded ? <Minimize2 className="h-4 w-4 dark:text-white" /> : <Maximize2 className="h-4 w-4 dark:text-white" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="text-primary-foreground dark:text-primary hover:bg-primary-foreground/10 dark:hover:bg-primary/10"
                                    >
                                        <X className="h-4 w-4 dark:text-white" />
                                    </Button>
                                </div>
                            </div>
                            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary dark:bg-gray-700 text-secondary-foreground dark:text-gray-100'
                                                }`}
                                        >
                                            {message.text}
                                            {message.file && (
                                                <div className="mt-2">
                                                    {message.file.type === 'image' && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Image src={message.file.url} alt="User upload" width={200} height={200} className="max-w-full h-auto rounded-md cursor-pointer" />
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                                                                <Image src={message.file.url} alt="User upload" width={400} height={400} className="w-full h-auto rounded-md" />
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                    {message.file.type === 'audio' && <audio src={message.file.url} controls className="w-full" />}
                                                    {message.file.type === 'video' && <video src={message.file.url} controls className="w-full h-auto rounded-md" />}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-secondary dark:bg-gray-700 text-secondary-foreground dark:text-gray-100 p-3 rounded-lg">
                                            <span className="animate-pulse">AI is typing...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </ScrollArea>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                {file && (
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground text-black dark:text-gray-400 truncate">{file.name}</span>
                                        <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Remove</Button>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        className="flex-grow bg-secondary/50 dark:bg-gray-700 text-secondary-foreground dark:text-gray-100 placeholder-secondary-foreground/50 dark:placeholder-gray-400"
                                    />
                                    <Button onClick={() => fileInputRef.current?.click()} className="bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary hover:bg-primary/90 dark:hover:bg-primary-foreground/90">
                                        <Paperclip className="w-4 h-4 dark:text-white" />
                                    </Button>
                                    <Button onClick={sendMessage} className="bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary hover:bg-primary/90 dark:hover:bg-primary-foreground/90">
                                        <Send className="w-4 h-4 dark:text-white" />
                                    </Button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*,audio/*,video/*"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}