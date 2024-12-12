import { FaRegUser } from 'react-icons/fa';

export default function TorusAvatar({
  color,
  src,
  borderColor,
  radius,
  size,
  className,
}) {
  const isArray = Array.isArray(src);
  const displaySrc = isArray ? src.slice(0, 4) : [src];
  const remainingCount = isArray ? src.length - 4 : 0;

  return (
    <div
      className={`flex  items-center ${src && src?.length > 0 ? 'justify-center xl:-space-x-2 2xl:-space-x-3' : 'justify-center'}`}
    >
      {displaySrc.map((source, index) => (
        <div
          key={index}
          className={`
            flex items-center justify-center
            ${
              radius === 'sm'
                ? 'rounded-sm'
                : radius === 'md'
                  ? 'rounded-md'
                  : radius === 'lg'
                    ? 'rounded-lg'
                    : radius === 'full'
                      ? 'rounded-full'
                      : ''
            }
            ${
              size === 'sm'
                ? 'h-3 w-3'
                : size === 'md'
                  ? 'h-5 w-5'
                  : size === 'lg'
                    ? 'xs:h-[40px] xs:w-[40px]   xxs:h-[40px] xxs:w-[40px] h-8 w-8 sm:h-[40px] sm:w-[40px] md:h-[40px] md:w-[40px] lg:h-[40px] lg:w-[40px] xl:h-[30px] xl:w-[30px] 2xl:h-[35px] 2xl:w-[35px] '
                    : size === 'full'
                      ? 'h-[35px] w-[35px]'
                      : size
            }
            ${className}
            border-2
            bg-transparent ${borderColor}
          `}
        >
          {!source && (
            <FaRegUser
              color={color}
              size={
                size === 'sm'
                  ? 8
                  : size === 'md'
                    ? 10
                    : size === 'lg'
                      ? 8
                      : size === 'full'
                        ? 15
                        : 10
              }
            />
          )}

          {source && (
            <img
              src={source}
              alt="avatar"
              className="inline-block h-[100%] w-[100%] rounded-full ring-2 ring-white dark:ring-neutral-900"
            />
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            flex 
            items-center justify-center
            ${
              radius === 'sm'
                ? 'rounded-sm'
                : radius === 'md'
                  ? 'rounded-md'
                  : radius === 'lg'
                    ? 'rounded-lg'
                    : radius === 'full'
                      ? 'rounded-full'
                      : ''
            }
            ${
              size === 'sm'
                ? 'h-3 w-3'
                : size === 'md'
                  ? 'h-5 w-5'
                  : size === 'lg'
                    ? 'h-8 w-8 xl:h-[30px] xl:w-[30px] 2xl:h-[35px] 2xl:w-[35px]'
                    : size === 'full'
                      ? 'h-full w-full'
                      : 'h-5 w-5'
            }
            border-2
            bg-[#0736C4] ${borderColor}
          `}
        >
          <span className="font-inter text-xs font-medium text-white">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
