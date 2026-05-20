export function FollowCard({
  name,
  handle = '@spongeclub.ai',
  imageUrl,
  fallbackEmoji = '📰',
  round = false
}: {
  name?: string;
  handle?: string;
  imageUrl?: string | null;
  fallbackEmoji?: string;
  // When true, render the icon box as a circle (used for the primary
  // spongeclub follow card's logo image). Square is the default.
  round?: boolean;
}) {
  return (
    <div className="follow-card">
      <div
        className={`follow-card__icon ${round ? 'follow-card__icon--round' : ''}`}
        aria-hidden
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit'
            }}
          />
        ) : (
          fallbackEmoji
        )}
      </div>
      <div className="follow-card__text">
        {name && <div className="follow-card__name">{name}</div>}
        <div className={name ? 'follow-card__handle' : 'follow-card__name'}>{handle}</div>
      </div>
      <div className="follow-card__button">+ 팔로우</div>
    </div>
  );
}
