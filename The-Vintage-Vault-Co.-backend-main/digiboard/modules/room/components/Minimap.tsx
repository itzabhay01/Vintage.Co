import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewPortSize } from "@/common/hooks/useViewportSize";
import { MotionValue, useMotionValue, motion } from "framer-motion";
import { Dispatch, forwardRef, SetStateAction, useEffect, useRef } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";

const MiniMap = forwardRef<
  HTMLCanvasElement,
  {
    dragging: boolean;
    setMovedMinimap: Dispatch<SetStateAction<boolean>>;
  }
>(({dragging, setMovedMinimap }, ref) => {
  const {x,y} = useBoardPosition()
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useViewPortSize();

  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  // useEffect(() => {
  //   miniX.onChange((newX) => {
  //     if (!dragging) x.set(-newX * 10);
  //   });
  //   miniY.onChange((newY) => {
  //     if (!dragging) y.set(-newY * 10);
  //   });

  //   return () => {
  //     miniX.clearListeners();
  //     miniY.clearListeners();
  //   };
  // }, [dragging, miniX, miniY]);

  useEffect(() => {
    const unsubscribeX = miniX.on("change", (newX: number) => {
        if (!dragging) x.set(-newX * 10);
    });

    const unsubscribeY = miniY.on("change", (newY: number) => {
        if (!dragging) y.set(-newY * 10);
    });

    return () => {
        unsubscribeX(); // Cleanup for X
        unsubscribeY(); // Cleanup for Y
    };
}, [dragging, miniX, miniY]);

  return (
    <div
      className="absolute right-10 top-10 z-50 bg-zinc-400"
      ref={containerRef}
      style={{
        width: CANVAS_SIZE.width / 10,
        height: CANVAS_SIZE.height / 10,
      }}
    >
      <canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => setMovedMinimap((prev) => !prev)}
        onDragEnd={() => setMovedMinimap((prev: boolean) => !prev)}
        className="absolute top-0 left-0 cursor-grab border-2 border-red-500"
        style={{
          width: width / 10,
          height: height / 10,
          x: miniX,
          y: miniY,
        }}
        animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
        transition={{ duration: 0 }}
      ></motion.div>
    </div>
  );
});

MiniMap.displayName = "MiniMap";

export default MiniMap;
