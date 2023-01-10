import React, { memo } from 'react';
import { ITextConfig } from './schema';
import logo from '@/assets/text.png';
const Text = memo((props: ITextConfig & { isTpl: boolean }) => {
  const { align, text, fontSize, color, lineHeight, isTpl, flexCenter } = props;

  return (
    <>
      {isTpl ? (
        <div>
          <img src={logo} alt=""></img>
        </div>
      ) : (
        <div
          style={{
            color,
            textAlign: align,
            fontSize,
            lineHeight,
            height: flexCenter ? '100%' : 'auto',
          }}
        >
          {flexCenter ? (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {text}
            </div>
          ) : (
            text
          )}
        </div>
      )}
    </>
  );
});
export default Text;
