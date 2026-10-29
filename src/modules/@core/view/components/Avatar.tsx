import { useState } from 'react';
import { Image, View } from 'react-native';

export function Avatar({
  name,
  email,
  avatarPath,
}: {
  name: string;
  email: string;
  avatarPath?: string | null;
}) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1039B8&color=fff&size=256`;
  const [imageSource, setImageSource] = useState(avatarPath || fallback);

  return (
    <View className="h-28 w-28 overflow-hidden rounded-full bg-[#1039B8]">
      <Image
        accessibilityLabel={`Avatar de ${name || email}`}
        className="h-full w-full"
        source={{ uri: imageSource }}
        onError={() => {
          if (imageSource !== fallback) setImageSource(fallback);
        }}
      />
    </View>
  );
}