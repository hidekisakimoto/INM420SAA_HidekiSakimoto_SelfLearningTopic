import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/ziggs.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.021, -0.01, 0]} rotation={[-Math.PI / 2, 0.044, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={nodes.GLTF_created_0_rootJoint} />
          <skinnedMesh
            geometry={nodes.Object_7.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_7.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_9.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_9.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_11.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_11.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_13.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_13.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_15.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_15.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_17.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_17.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_19.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_19.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_21.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_21.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_23.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_23.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_25.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_25.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_27.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_27.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_29.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_29.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_31.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_31.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_33.geometry}
            material={materials.ZiggsTexture}
            skeleton={nodes.Object_33.skeleton}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/ziggs.glb')
