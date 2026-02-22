import { profileConfig } from '../config/profile'

interface LinkedInPreviewProps {
  content: string
  author?: string
  title?: string
  avatar?: string
  media?: string
}

export default function LinkedInPreview({ 
  content,
  author = profileConfig.linkedin.name,
  title = profileConfig.linkedin.title,
  avatar = profileConfig.linkedin.avatar,
  media
}: LinkedInPreviewProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={avatar} 
            alt={author}
            className="w-12 h-12 rounded-full bg-gray-200"
          />
          <div className="flex-1">
            <div className="font-semibold text-[14px] text-gray-900 hover:underline hover:text-blue-700">
              {author}
            </div>
            <div className="text-[12px] text-gray-600 leading-tight">
              {title}
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 mt-1">
              <span>Just now</span>
              <span>•</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM3 8a5 5 0 1110 0A5 5 0 013 8z"/>
              </svg>
            </div>
          </div>
          <button className="text-gray-600 hover:bg-gray-100 rounded p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-[14px] text-gray-900 whitespace-pre-wrap">
          {content}
        </div>
      </div>

      {/* Media */}
      {media && (
        <div className="w-full bg-gray-100">
          {media.endsWith('.mp4') || media.endsWith('.mov') ? (
            <video 
              src={media} 
              controls 
              className="w-full"
              style={{ maxHeight: '500px' }}
            />
          ) : (
            <img 
              src={media} 
              alt="Media" 
              className="w-full"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-300 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="flex items-center gap-2 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded text-[14px] font-semibold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Like
          </button>
          <button className="flex items-center gap-2 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded text-[14px] font-semibold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment
          </button>
          <button className="flex items-center gap-2 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded text-[14px] font-semibold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Repost
          </button>
          <button className="flex items-center gap-2 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded text-[14px] font-semibold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
