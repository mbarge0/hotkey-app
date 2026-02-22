import { profileConfig } from '../config/profile'

interface TwitterPreviewProps {
  content: string
  author?: string
  handle?: string
  avatar?: string
  media?: string
}

export default function TwitterPreview({ 
  content, 
  author = profileConfig.name,
  handle = profileConfig.twitter.handle,
  avatar = profileConfig.twitter.avatar,
  media
}: TwitterPreviewProps) {
  return (
    <div className="bg-black border border-gray-800 rounded-xl p-4 font-sans">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img 
          src={avatar} 
          alt={author}
          className="w-12 h-12 rounded-full bg-gray-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] text-white hover:underline">
              {author}
            </span>
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
            </svg>
          </div>
          <div className="text-[15px] text-gray-500">
            {handle}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-[15px] text-white whitespace-pre-wrap mb-3">
        {content}
      </div>

      {/* Media */}
      {media && (
        <div className="rounded-2xl overflow-hidden border border-gray-800 mb-3">
          {media.endsWith('.mp4') || media.endsWith('.mov') ? (
            <video 
              src={media} 
              controls 
              className="w-full"
              style={{ maxHeight: '400px' }}
            />
          ) : (
            <img 
              src={media} 
              alt="Media" 
              className="w-full"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          )}
        </div>
      )}

      {/* Meta */}
      <div className="text-[13px] text-gray-500">
        11:20 AM · Feb 21, 2026
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-400 group">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-green-400 group">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-pink-500 group">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-400 group">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
