export type MessageContent = string | string[] | { label: string; value: string }[] | {
    type: 'media'
    url: string
    mimeType: string
    fileName: string
}

export interface Message {
    type: 'text' | 'buttons' | 'quickReplies' | 'input' | 'media'
    content: MessageContent
    isUser: boolean
}

export interface WebSocketMessage {
    type: 'text' | 'buttons' | 'quickReplies' | 'input' | 'media'
    content: MessageContent
}