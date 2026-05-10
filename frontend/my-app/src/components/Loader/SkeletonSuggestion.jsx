import './skeleton.css'

export default function SkeletonSuggestion() {
  return (
    <div className="skel" aria-hidden="true">
      <div className="skel__media skel__shimmer" />
      <div className="skel__body">
        <div className="skel__line skel__shimmer" />
        <div className="skel__line skel__shimmer" />
        <div className="skel__line skel__line--short skel__shimmer" />
      </div>
    </div>
  )
}

