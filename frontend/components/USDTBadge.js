/**
 * USDT Badge Component
 * Displays Tether (USDT) logo with amount using the USDT icon image
 */

export default function USDTBadge({ amount, size = 'sm', showSymbol = true }) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Format the amount with Tether symbol
  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount;

  return (
    <span className="inline-flex items-center gap-1.5 text-emerald-400">
      {/* USDT Logo Image - with fallback SVG */}
      <picture>
        <source srcSet="/icon/usdt.png" type="image/png" />
        <img 
          src="/icon/usdt.png" 
          alt="USDT" 
          className={`${sizeClasses[size]} rounded`}
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'inline-block';
          }}
        />
        {/* Fallback SVG */}
        <svg 
          className={`${sizeClasses[size]} rounded hidden`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#009393"/>
          <path 
            d="M12 6.5C10.5 6.5 9.5 7.5 9.5 8.5C9.5 9.3 10 10.2 11 10.5V13.5C10 13.8 9.5 14.7 9.5 15.5C9.5 16.5 10.5 17.5 12 17.5C13.5 17.5 14.5 16.5 14.5 15.5C14.5 14.7 14 13.8 13 13.5V10.5C14 10.2 14.5 9.3 14.5 8.5C14.5 7.5 13.5 6.5 12 6.5ZM12 8.2C11.5 8.2 11.2 8.5 11.2 8.8C11.2 9.1 11.5 9.4 12 9.4C12.5 9.4 12.8 9.1 12.8 8.8C12.8 8.5 12.5 8.2 12 8.2ZM12 15.8C11.5 15.8 11.2 15.5 11.2 15.2C11.2 14.9 11.5 14.6 12 14.6C12.5 14.6 12.8 14.9 12.8 15.2C12.8 15.5 12.5 15.8 12 15.8Z" 
            fill="white"
          />
        </svg>
      </picture>
      {showSymbol && (
        <span className={`${textSizes[size]} font-mono`}>
          ₮{formattedAmount}
        </span>
      )}
    </span>
  );
}

/**
 * Small USDT indicator (just logo, no amount)
 */
export function USDTIcon({ size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <picture className="inline-block">
      <source srcSet="/icon/usdt.png" type="image/png" />
      <img 
        src="/icon/usdt.png" 
        alt="USDT" 
        className={`${sizeClasses[size]} rounded ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'inline-block';
        }}
      />
      {/* Fallback SVG */}
      <svg 
        className={`${sizeClasses[size]} rounded hidden ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="4" fill="#009393"/>
        <path 
          d="M12 6.5C10.5 6.5 9.5 7.5 9.5 8.5C9.5 9.3 10 10.2 11 10.5V13.5C10 13.8 9.5 14.7 9.5 15.5C9.5 16.5 10.5 17.5 12 17.5C13.5 17.5 14.5 16.5 14.5 15.5C14.5 14.7 14 13.8 13 13.5V10.5C14 10.2 14.5 9.3 14.5 8.5C14.5 7.5 13.5 6.5 12 6.5ZM12 8.2C11.5 8.2 11.2 8.5 11.2 8.8C11.2 9.1 11.5 9.4 12 9.4C12.5 9.4 12.8 9.1 12.8 8.8C12.8 8.5 12.5 8.2 12 8.2ZM12 15.8C11.5 15.8 11.2 15.5 11.2 15.2C11.2 14.9 11.5 14.6 12 14.6C12.5 14.6 12.8 14.9 12.8 15.2C12.8 15.5 12.5 15.8 12 15.8Z" 
          fill="white"
        />
      </svg>
    </picture>
  );
}

/**
 * Large USDT display for wallet balance
 */
export function USDTBalance({ amount, className = '' }) {
  const formattedAmount = typeof amount === 'number'
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* USDT Logo Image - Large with fallback */}
      <picture>
        <source srcSet="/icon/usdt.png" type="image/png" />
        <img 
          src="/icon/usdt.png" 
          alt="USDT" 
          className="w-10 h-10 rounded-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'inline-block';
          }}
        />
        {/* Fallback SVG */}
        <svg 
          className="w-10 h-10 rounded-lg hidden"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#009393"/>
          <path 
            d="M12 6.5C10.5 6.5 9.5 7.5 9.5 8.5C9.5 9.3 10 10.2 11 10.5V13.5C10 13.8 9.5 14.7 9.5 15.5C9.5 16.5 10.5 17.5 12 17.5C13.5 17.5 14.5 16.5 14.5 15.5C14.5 14.7 14 13.8 13 13.5V10.5C14 10.2 14.5 9.3 14.5 8.5C14.5 7.5 13.5 6.5 12 6.5ZM12 8.2C11.5 8.2 11.2 8.5 11.2 8.8C11.2 9.1 11.5 9.4 12 9.4C12.5 9.4 12.8 9.1 12.8 8.8C12.8 8.5 12.5 8.2 12 8.2ZM12 15.8C11.5 15.8 11.2 15.5 11.2 15.2C11.2 14.9 11.5 14.6 12 14.6C12.5 14.6 12.8 14.9 12.8 15.2C12.8 15.5 12.5 15.8 12 15.8Z" 
            fill="white"
          />
        </svg>
      </picture>
      <span className="text-3xl font-bold text-emerald-400 font-mono">
        ₮{formattedAmount}
      </span>
    </span>
  );
}

/**
 * Inline USDT image for use in text
 */
export function USDTImage({ size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <picture className="inline-block">
      <source srcSet="/icon/usdt.png" type="image/png" />
      <img 
        src="/icon/usdt.png" 
        alt="USDT" 
        className={`inline-block ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'inline-block';
        }}
      />
      {/* Fallback SVG */}
      <svg 
        className={`inline-block ${sizeClasses[size]} hidden ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="4" fill="#009393"/>
        <path 
          d="M12 6.5C10.5 6.5 9.5 7.5 9.5 8.5C9.5 9.3 10 10.2 11 10.5V13.5C10 13.8 9.5 14.7 9.5 15.5C9.5 16.5 10.5 17.5 12 17.5C13.5 17.5 14.5 16.5 14.5 15.5C14.5 14.7 14 13.8 13 13.5V10.5C14 10.2 14.5 9.3 14.5 8.5C14.5 7.5 13.5 6.5 12 6.5ZM12 8.2C11.5 8.2 11.2 8.5 11.2 8.8C11.2 9.1 11.5 9.4 12 9.4C12.5 9.4 12.8 9.1 12.8 8.8C12.8 8.5 12.5 8.2 12 8.2ZM12 15.8C11.5 15.8 11.2 15.5 11.2 15.2C11.2 14.9 11.5 14.6 12 14.6C12.5 14.6 12.8 14.9 12.8 15.2C12.8 15.5 12.5 15.8 12 15.8Z" 
          fill="white"
        />
      </svg>
    </picture>
  );
}