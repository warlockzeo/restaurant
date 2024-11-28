import React, { useRef, useEffect, useState } from 'react';
import { ResizeBoxWrap } from './ResizeBoxStyle';

const ResizeBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [touched, setTouched] = useState('');
  const refBox = useRef<HTMLDivElement | null>(null);
  const refTop = useRef<HTMLDivElement | null>(null);
  const refRight = useRef<HTMLDivElement | null>(null);
  const refBottom = useRef<HTMLDivElement | null>(null);
  const refLeft = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeableElement = refBox.current;
    if (!resizeableElement) return;

    const styles = window.getComputedStyle(resizeableElement);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);

    let xCord = 0;
    let yCord = 0;

    resizeableElement.style.top = '150px';
    resizeableElement.style.left = '150px';

    // Top Resizer
    const onMouseMoveTopResize = (event: MouseEvent | TouchEvent) => {
      let y;
      if (event instanceof TouchEvent) {
        setTouched('move');
        y = event.touches[0].clientY;
      } else {
        y = event.clientY;
      }
      const dy = y - yCord;
      height -= dy;
      yCord = y;
      resizeableElement.style.height = `${height}px`;
    };

    const onMouseUpTopResize = () => {
      setTouched('');
      document.removeEventListener('mousemove', onMouseMoveTopResize);
      document.removeEventListener('touchmove', onMouseMoveTopResize);
    };

    const onMouseDownTopResize = (event: MouseEvent | TouchEvent) => {
      if (event instanceof TouchEvent) {
        setTouched('touch');
        yCord = event.touches[0].clientY;
      } else {
        yCord = event.clientY;
      }
      const styles = window.getComputedStyle(resizeableElement);
      resizeableElement.style.bottom = styles.bottom;
      resizeableElement.style.top = '';
      document.addEventListener('mousemove', onMouseMoveTopResize);
      document.addEventListener('mouseup', onMouseUpTopResize);
      document.addEventListener('touchmove', onMouseMoveTopResize);
      document.addEventListener('touchend', onMouseUpTopResize);
    };

    // Right Resizer
    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - xCord;
      width += dx;
      xCord = event.clientX;
      resizeableElement.style.width = `${width}px`;
    };

    const onMouseUpRightResize = () => {
      document.removeEventListener('mousemove', onMouseMoveRightResize);
    };

    const onMouseDownRightResize = (event: MouseEvent) => {
      xCord = event.clientX;
      const styles = window.getComputedStyle(resizeableElement);
      resizeableElement.style.left = styles.left;
      resizeableElement.style.right = '';
      document.addEventListener('mousemove', onMouseMoveRightResize);
      document.addEventListener('mouseup', onMouseUpRightResize);
    };

    // Bottom Resizer
    const onMouseMoveBottomResize = (event: MouseEvent) => {
      const dy = event.clientY - yCord;
      height += dy;
      yCord = event.clientY;
      resizeableElement.style.height = `${height}px`;
    };

    const onMouseUpBottomResize = () => {
      document.removeEventListener('mousemove', onMouseMoveBottomResize);
    };

    const onMouseDownBottomResize = (event: MouseEvent) => {
      yCord = event.clientY;
      const styles = window.getComputedStyle(resizeableElement);
      resizeableElement.style.top = styles.top;
      resizeableElement.style.bottom = '';
      document.addEventListener('mousemove', onMouseMoveBottomResize);
      document.addEventListener('mouseup', onMouseUpBottomResize);
    };

    // Left Resizer
    const onMouseMoveLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - xCord;
      width -= dx;
      xCord = event.clientX;
      resizeableElement.style.width = `${width}px`;
    };

    const onMouseUpLeftResize = () => {
      document.removeEventListener('mousemove', onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (event: MouseEvent) => {
      xCord = event.clientX;
      const styles = window.getComputedStyle(resizeableElement);
      resizeableElement.style.right = styles.right;
      resizeableElement.style.left = '';
      document.addEventListener('mousemove', onMouseMoveLeftResize);
      document.addEventListener('mouseup', onMouseUpLeftResize);
    };

    // Adding event listeners
    refRight.current?.addEventListener('mousedown', onMouseDownRightResize);
    refTop.current?.addEventListener('mousedown', onMouseDownTopResize);
    refBottom.current?.addEventListener('mousedown', onMouseDownBottomResize);
    refLeft.current?.addEventListener('mousedown', onMouseDownLeftResize);
    refTop.current?.addEventListener('touchstart', onMouseDownTopResize);

    return () => {
      refRight.current?.removeEventListener(
        'mousedown',
        onMouseDownRightResize
      );
      refTop.current?.removeEventListener('mousedown', onMouseDownTopResize);
      refBottom.current?.removeEventListener(
        'mousedown',
        onMouseDownBottomResize
      );
      refLeft.current?.removeEventListener('mousedown', onMouseDownLeftResize);
    };
  }, []);

  return (
    <>
      <ResizeBoxWrap
        ref={refBox}
        className='resizeable-box bg-gray-600  border-black min-h-20 max-h-80 overflow-y-auto'
      >
        {/* <div
          ref={refLeft}
          className='resizer rl'
          
        >
 
        </div> */}
        <div
          id='mydivheader'
          ref={refTop}
          className='resizer rt fixed w-full'
        ></div>
        {/* <div
          ref={refRight}
          className='resizer rr'
          
        >
    
        </div> */}
        {children}
        {/* <div
          ref={refBottom}
          className='resizer rb'
          
        >
   
        </div> */}
      </ResizeBoxWrap>
    </>
  );
};

export default ResizeBox;
