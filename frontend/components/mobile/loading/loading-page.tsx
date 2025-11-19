import { SpinningText } from "@/components/ui/spinning-text"

interface LoadingPageProps {
  title?: string
  loadingText?: string
  className?: string
}

export function LoadingPage({title="",loadingText="",className=""}:LoadingPageProps) {
  return (
      <div className="flex items-center justify-center min-h-42">
        <SpinningText radius={5} fontSize={1} className={`font-medium leading-none ${className || ''}`}>
          {loadingText}
        </SpinningText>
      </div>
  )
}