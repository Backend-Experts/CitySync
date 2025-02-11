import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const HomeIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 21v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2m4-12l8 5.333M12 3l-8 5.333"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default HomeIcon;