/** A module as the admin content page uses it: its package links flattened to ids. */
export function withPackageIds<T extends { packages: { id: string }[] }>({ packages, ...mod }: T) {
  return { ...mod, packageIds: packages.map((p) => p.id) };
}
