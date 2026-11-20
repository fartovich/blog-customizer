import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps.ts';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { ArticleStateType } from '@/constants/articleProps.ts';
import type { FormEvent } from 'react';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (settings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const asideRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      const target = event.target;
      if (
        target instanceof Node &&
        !asideRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return (): void => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
    setIsOpen(false);
  };

  const handleReset = (): void => {
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <>
      <div ref={toggleRef}>
        <ArrowButton isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
      </div>
      <aside
        ref={asideRef}
        className={clsx(styles.container, { [styles.container_open]: isOpen })}
        aria-hidden={!isOpen}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            title="Шрифт"
            selected={formState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={(option) =>
              setFormState((state) => ({ ...state, fontFamilyOption: option }))
            }
          />
          <RadioGroup
            title="Размер шрифта"
            name="fontSize"
            selected={formState.fontSizeOption}
            options={fontSizeOptions}
            onChange={(option) =>
              setFormState((state) => ({ ...state, fontSizeOption: option }))
            }
          />
          <Select
            title="Цвет шрифта"
            selected={formState.fontColor}
            options={fontColors}
            onChange={(option) =>
              setFormState((state) => ({ ...state, fontColor: option }))
            }
          />
          <Separator />
          <Select
            title="Цвет фона"
            selected={formState.backgroundColor}
            options={backgroundColors}
            onChange={(option) =>
              setFormState((state) => ({ ...state, backgroundColor: option }))
            }
          />
          <Select
            title="Ширина контента"
            selected={formState.contentWidth}
            options={contentWidthArr}
            onChange={(option) =>
              setFormState((state) => ({ ...state, contentWidth: option }))
            }
          />
          <div className={styles.bottomContainer}>
            <Button
              title="Сбросить"
              htmlType="button"
              type="clear"
              onClick={handleReset}
            />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
