import { LifeLine } from 'react-loading-indicators';
import '../styles/components/loading.scss';

type Easing =
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
  | 'cubic-bezier(0.42, 0.0, 1.0, 1.0)'
  | 'cubic-bezier(0.0, 0.0, 0.58, 1.0)'
  | 'cubic-bezier(0.42, 0.0, 0.58, 1.0)'
  | 'linear(0, 1)'
  | 'steps(4, end)'
  | (string & {});

interface LoadingInterface {
  color?: string;
  text?: string;
  textColor?: string;
  size?: any;
  easing?: Easing;
  ServerUrl: string;
}

export function FirstLoading(props: LoadingInterface) {
  let { color, size, text, textColor, easing, ServerUrl } = props;

  if (!color) color = '#ffffff';
  if (!size) size = 'medium';
  if (!textColor) textColor = color;
  if (!text) text = 'Mengambil data';
  if (!easing) easing = 'ease-in-out';

  // This maybe dynamic (SOON)
  const Background = `${ServerUrl}/static/img/island-night-moon.jpg`;

  return (
    <div
      className="First-Loading-Container"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="First-Loading-Box">
        <LifeLine
          color={color}
          easing={easing}
          size={size}
          text={text}
          textColor={textColor}
        />
      </div>
    </div>
  );
}
