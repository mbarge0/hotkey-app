import { profileConfig } from '../config/profile'

interface InstagramPreviewProps {
  content: string
  author?: string
  handle?: string
  avatar?: string
  media?: string
}

export default function InstagramPreview({ 
  content,
  author = profileConfig.name,
  handle = profileConfig.instagram.handle,
  avatar = profileConfig.instagram.avatar,
  media
}: InstagramPreviewProps) {
  return (
    <div className="bg-white border border-gray-300 font-sans" style={{ maxWidth: '468px' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
            <img 
              src={avatar} 
              alt={author}
              className="w-full h-full rounded-full bg-white border-2 border-white"
            />
          </div>
          <span className="font-semibold text-[14px] text-gray-900">
            {handle}
          </span>
        </div>
        <button className="text-gray-900">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Media */}
      {media ? (
        <div className="w-full bg-black" style={{ aspectRatio: '1/1' }}>
          {media.endsWith('.mp4') || media.endsWith('.mov') ? (
            <video 
              src={media} 
              controls 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={media} 
              alt="Post" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ) : (
        <div className="w-full bg-gray-100 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="hover:opacity-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="hover:opacity-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button className="hover:opacity-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-[14px] text-gray-900 mb-2">
          0 likes
        </div>

        {/* Caption */}
        <div className="text-[14px] text-gray-900 mb-3">
          <span className="font-semibold mr-2">{handle}</span>
          <span className="whitespace-pre-wrap">{content}</span>
        </div>

        {/* Meta */}
        <div className="text-[10px] text-gray-500 uppercase mb-3">
          JUST NOW
        </div>
      </div>
    </div>
  )
}
