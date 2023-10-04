import { useEffect, useRef } from 'react';
import { Renderer, Program, Vec2, Mesh, Triangle, Texture } from 'ogl'
// @ts-ignore
import vertex from '../glsl/main.vert'
// @ts-ignore
import fragment from '../glsl/main.frag'
import gsap from 'gsap'
import baseImage from '../assets/milky-way.jpg'

const Scene = () => {
    const canvasRef = useRef(null);
    const renderer = useRef(null);
    const mesh = useRef(null);
    const program = useRef(null);
    const mouse = useRef(new Vec2(0.5, 0.5));

    useEffect(() => {
        const canvasEl = canvasRef.current;

        if (canvasEl === null) return;

        // const gl = (canvasEl as HTMLCanvasElement).getContext('webgl');
        const handleResize = () => {
            (renderer.current as any).setSize(window.innerWidth, window.innerHeight)

            if (program.current !== null) {
              (program.current as any).uniforms.uResolution.value = new Vec2(window.innerWidth, window.innerHeight)
            }
        }

        async function setScene() {
            renderer.current = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), canvas: canvasEl });

            if (renderer.current === null) return;

            const gl = (renderer.current as any).gl;
            gl.clearColor(1, 1, 1, 1,);

            const loadTexture = (url: string) => {
                return new Promise((resolve: any) => {
                    const image = new Image();
                    const texture = new Texture(gl);

                    image.onload = () => {
                        texture.image = image;
                        resolve(texture);
                    }

                    image.src = url;
                })
            };

            const texture = await loadTexture(baseImage);

            handleResize();

            const geometry = new Triangle(gl);

            program.current = new Program(gl, {
                vertex,
                fragment,
                uniforms: {
                    uTime: { value: 0 },
                    uTexture: { value: texture },
                    uTextureResolution: { value: new Vec2((texture as any).image.width, (texture as any).image.height) },
                    uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
                    uMouse: { value: new Vec2(0.5, 0.5) },
                    uBulge: { value: 0 }
                }
            });

            mesh.current = new Mesh(gl, { geometry, program: program.current });
        }

        setScene();

        const handleRAF = () => {
            requestAnimationFrame(handleRAF);

            if (mesh.current !== null) {
                (renderer.current as any).render({ scene: mesh.current });
                (program.current as any).uniforms.uMouse.value = mouse.current;
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth
            const y = 1 - e.clientY / window.innerHeight

            mouse.current.x = gsap.utils.clamp(0, 1, x)
            mouse.current.y = gsap.utils.clamp(0, 1, y)
        }

        window.addEventListener('resize', handleResize, false);
        window.addEventListener('mousemove', handleMouseMove, false);

        (canvasEl as HTMLCanvasElement).addEventListener('mouseenter', () => {
            // (program.current as any).uniforms.uBulge.value = 1;
            gsap.to((program.current as any).uniforms.uBulge, {
                value: 1,
                duration: 1,
                ease: 'expo.out'
            })
        });

        (canvasEl as HTMLCanvasElement).addEventListener('mouseleave', () => {
            // (program.current as any).uniforms.uBulge.value = 0;
            gsap.to((program.current as any).uniforms.uBulge, {
                value: 0,
                duration: 1,
                ease: 'expo.out'
            })
        });

        requestAnimationFrame(handleRAF);

        // Clean up by removing event listeners when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize, false);
            window.removeEventListener('mousemove', handleMouseMove, false);
        };


    }, [])


    return (
        <canvas
          ref={canvasRef}
          className="scene"
          width={window.innerWidth / 2}
          height={window.innerHeight}
        />
      );
}

export default Scene;