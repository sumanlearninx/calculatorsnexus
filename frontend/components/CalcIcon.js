/**
 * CalcIcon.js
 * Displays either an uploaded icon image OR an emoji icon.
 * Always renders at the same size regardless of which type.
 *
 * Usage:
 *   <CalcIcon icon="🧮" iconImage={null} size={40} />
 *   <CalcIcon icon="🧮" iconImage="http://..." size={40} />
 */
export default function CalcIcon({ icon, iconImage, size = 40 }) {

    // If custom image uploaded → show it
    if (iconImage) {
        return (
            <img
                src={iconImage}
                alt={icon || 'calculator icon'}
                width={size}
                height={size}
                style={{
                    width:        size,
                    height:       size,
                    objectFit:    'contain',    // keeps aspect ratio
                    borderRadius: '6px',        // slight rounding
                    flexShrink:   0,            // never squish in flex
                }}
            />
        )
    }

    // Fallback → show emoji
    return (
        <span
            style={{
                fontSize:   size * 0.75,        // emoji scales with size
                lineHeight: 1,
                width:      size,
                height:     size,
                display:    'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
            aria-label={icon}
        >
            {icon || '🧮'}
        </span>
    )
}