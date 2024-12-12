import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/Store/store';
import Image from 'next/image';

interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: number | string; // Optional prop to adjust the size of the avatar
  isRounded?: boolean;
  localAccentcolor?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, name, size = 50 , isRounded = false , localAccentcolor}) => {
  // Get first two letters of the name
  const initials = name ? name.split(" ").length > 1 ? name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() : name.slice(0, 3).toUpperCase() : "";
    const accentColor = useSelector((state: RootState) => state.main.accentColor);

  // Helper function to calculate font size based on `size` type (number or string)
  const calculateFontSize = (size: number | string): string => {
    if (typeof size === 'number') {
      return `${size / 2.5}px`;
    }
    // Extract numeric value from string size (e.g., '10vw' -> 10)
    const numericValue = parseFloat(size);
    if (size.includes('vw') || size.includes('vh')) {
      return `${numericValue / 2.5}vw`; // Adjust font size in relation to viewport unit
    } else {
      return `${numericValue / 2.5}px`; // Fallback for px or other units
    }
  };

  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: isRounded ? '50%' : '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: calculateFontSize(size),
      backgroundColor: imageUrl ? 'unset' : localAccentcolor? localAccentcolor : accentColor,
    //  backgroundColor: imageUrl ? localAccentcolor : accentColor,
    color: '#fff',
    textTransform: 'uppercase',
    overflow: 'hidden',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: isRounded ? '50%' : '25%',
  };

  return (
    <div style={avatarStyle}>
      {imageUrl ? (
        <Image width={100} height={100} src={imageUrl} alt={name} style={imageStyle} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
