import { BodySlide } from '../../../state/bodySlide';
import { TextField } from '../../fields';

type Props = {
  slide: BodySlide;
  patch: (p: Partial<BodySlide>) => void;
};

export function HeroFields({ slide, patch }: Props) {
  return (
    <TextField
      label="짧은 본문"
      value={slide.heroBody}
      onChange={(v) => patch({ heroBody: v })}
      multiline
      rows={3}
      helper="2~3줄 권장"
    />
  );
}
