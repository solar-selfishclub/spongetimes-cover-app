import { BodySlide, BODY_TEMPLATES, TEMPLATE_LABEL } from '../../state/bodySlide';
import { ContentType, PublisherName } from '../../tokens';
import {
  CheckboxField,
  ImageField,
  RangeField,
  SelectField,
  TextField
} from '../fields';
import { CharacterPromptCopy } from '../../character/CharacterPromptCopy';
import { HeroFields } from './bodyTemplates/HeroFields';
import { QuoteFields } from './bodyTemplates/QuoteFields';
import { QuoteMultiFields } from './bodyTemplates/QuoteMultiFields';
import { FlowFields } from './bodyTemplates/FlowFields';
import { SideProfileFields } from './bodyTemplates/SideProfileFields';
import { GridHeroFields } from './bodyTemplates/GridHeroFields';

type Props = {
  slide: BodySlide;
  index: number;
  publisher: PublisherName;
  contentType: ContentType;
  patch: (p: Partial<BodySlide>) => void;
};

export function BodyEditor({ slide, index, publisher, contentType, patch }: Props) {
  return (
    <div className="form-section">
      <h2>본문 {index + 1} · {TEMPLATE_LABEL[slide.template]}</h2>

      {/* Template picker */}
      <div className="field">
        <label>템플릿</label>
        <select
          value={slide.template}
          onChange={(e) => patch({ template: e.target.value as BodySlide['template'] })}
        >
          {BODY_TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {TEMPLATE_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      {/* === Heading === */}
      <TextField
        label="헤딩 텍스트"
        value={slide.heading}
        onChange={(v) => patch({ heading: v })}
        multiline
        rows={2}
        helper="줄바꿈은 엔터. QUOTE 템플릿에선 헤딩이 작게 들어가거나 생략됨"
      />
      <div className="field-row">
        <RangeField
          label="헤딩 크기"
          value={slide.headingSize}
          min={40}
          max={140}
          unit="px"
          onChange={(v) => patch({ headingSize: v })}
        />
        <SelectField
          label="헤딩 정렬"
          value={slide.headingAlign}
          options={['left', 'center'] as const}
          onChange={(v) => patch({ headingAlign: v })}
        />
      </div>
      <TextField
        label="형광펜 강조 단어 (쉼표 구분, 최대 2)"
        value={slide.headingHighlight}
        onChange={(v) => patch({ headingHighlight: v })}
      />

      {/* === 4-corner anchor === */}
      <hr className="editor-divider" />
      <div className="field">
        <label>4코너 anchor</label>
      </div>
      <div className="field-row">
        <TextField
          label="카테고리 (좌상단)"
          value={slide.anchorCategory}
          onChange={(v) => patch({ anchorCategory: v })}
          placeholder="WEEK 1 · MISSION"
        />
        <CheckboxField
          label="우하단 ★ 표시"
          value={slide.anchorStar}
          onChange={(v) => patch({ anchorStar: v })}
        />
      </div>
      <CheckboxField
        label="우상단 알약 라벨"
        value={slide.anchorBadgeEnabled}
        onChange={(v) => patch({ anchorBadgeEnabled: v })}
      />
      {slide.anchorBadgeEnabled && (
        <div className="field-row">
          <TextField
            label="라벨 텍스트"
            value={slide.anchorBadge}
            onChange={(v) => patch({ anchorBadge: v })}
          />
          <SelectField
            label="라벨 색"
            value={slide.anchorBadgeVariant}
            options={['dark', 'yellow'] as const}
            onChange={(v) => patch({ anchorBadgeVariant: v })}
          />
        </div>
      )}

      {/* === Subcaption === */}
      <hr className="editor-divider" />
      <CheckboxField
        label="부캡션"
        value={slide.subcaptionEnabled}
        onChange={(v) => patch({ subcaptionEnabled: v })}
      />
      {slide.subcaptionEnabled && (
        <TextField
          label="부캡션 텍스트"
          value={slide.subcaption}
          onChange={(v) => patch({ subcaption: v })}
          multiline
          rows={2}
        />
      )}

      {/* === Inline pill label (above heading) === */}
      <CheckboxField
        label="헤딩 위 알약 라벨"
        value={slide.pillEnabled}
        onChange={(v) => patch({ pillEnabled: v })}
      />
      {slide.pillEnabled && (
        <div className="field-row">
          <TextField
            label="알약 텍스트"
            value={slide.pillText}
            onChange={(v) => patch({ pillText: v })}
          />
          <SelectField
            label="알약 색"
            value={slide.pillVariant}
            options={['dark', 'yellow'] as const}
            onChange={(v) => patch({ pillVariant: v })}
          />
        </div>
      )}

      {/* === Yellow circle deco === */}
      <CheckboxField
        label="큰 노란 원 배경 데코"
        value={slide.decoEnabled}
        onChange={(v) => patch({ decoEnabled: v })}
      />
      {slide.decoEnabled && (
        <>
          <div className="field-row">
            <SelectField
              label="위치"
              value={slide.decoPosition}
              options={
                ['right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as const
              }
              onChange={(v) => patch({ decoPosition: v })}
            />
            <SelectField
              label="크기"
              value={slide.decoSize}
              options={['small', 'medium', 'large'] as const}
              onChange={(v) => patch({ decoSize: v })}
            />
          </div>
          <SelectField
            label="모양"
            value={slide.decoShape}
            options={['circle', 'half-circle', 'dot', 'curve'] as const}
            onChange={(v) => patch({ decoShape: v })}
          />
        </>
      )}

      {/* === Image slot === */}
      <CheckboxField
        label="이미지 슬롯"
        value={slide.imageEnabled}
        onChange={(v) => patch({ imageEnabled: v })}
        helper="캐릭터·사진·UI 캡처 자유 — 비워두면 텍스트만"
      />
      {slide.imageEnabled && (
        <>
          <ImageField
            label="이미지 업로드"
            value={slide.image}
            onChange={(v) => patch({ image: v })}
            helper="투명 배경 PNG 권장 (캐릭터의 경우)"
          />
          <RangeField
            label="이미지 크기"
            value={slide.imageSize}
            min={10}
            max={70}
            unit="%"
            onChange={(v) => patch({ imageSize: v })}
          />
          <div className="field-row">
            <RangeField
              label="가로 위치 (X)"
              value={slide.imageX}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => patch({ imageX: v })}
            />
            <RangeField
              label="세로 위치 (Y)"
              value={slide.imageY}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => patch({ imageY: v })}
            />
          </div>
          <CharacterPromptCopy
            publisher={publisher}
            contentType={contentType}
            slideType="body"
            title="본문 캐릭터 프롬프트"
          />
        </>
      )}

      {/* === Template-specific fields === */}
      <hr className="editor-divider" />
      {slide.template === 'hero' && <HeroFields slide={slide} patch={patch} />}
      {slide.template === 'quote' && <QuoteFields slide={slide} patch={patch} />}
      {slide.template === 'quote-multi' && <QuoteMultiFields slide={slide} patch={patch} />}
      {slide.template === 'flow' && <FlowFields slide={slide} patch={patch} />}
      {slide.template === 'side-profile' && <SideProfileFields slide={slide} patch={patch} />}
      {slide.template === 'grid-hero' && <GridHeroFields slide={slide} patch={patch} />}
    </div>
  );
}
