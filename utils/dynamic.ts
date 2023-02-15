import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type JSXElementConstructor,
} from 'react'

type PropsOf<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<unknown>
> = JSX.LibraryManagedAttributes<C, ComponentPropsWithoutRef<C>>

type AsProp<C extends ElementType> = {
  as?: C
}

type ExtendableProps<
  ExtendedProps = unknown,
  OverrideProps = unknown
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>

type InheritableElementProps<
  C extends ElementType,
  Props = unknown
> = ExtendableProps<PropsOf<C>, Props>

type PolymorphicComponentProps<
  C extends ElementType,
  Props = unknown
> = InheritableElementProps<C, Props & AsProp<C>>

export type ContainerProps<
  C extends ElementType,
  Props
> = PolymorphicComponentProps<C, Props>

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType &
    (string | boolean | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | boolean | number)]
