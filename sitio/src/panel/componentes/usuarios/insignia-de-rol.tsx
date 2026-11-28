// Rol de una cuenta: insignia neutra sin punto (no es un estado), como en la maqueta.
export function InsigniaDeRol({ rol }: { rol: string }) {
  return (
    <span className="inline-flex w-fit rounded-full border bg-muted px-[0.55rem] py-[0.1rem] text-xs leading-normal font-semibold whitespace-nowrap text-foreground">
      {rol}
    </span>
  )
}
