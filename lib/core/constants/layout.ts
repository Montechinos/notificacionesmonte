// 📐 Constantes de Layout y Espaciado
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  };
  
  export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  };
  
  export const Layout = {
    screen: {
      padding: Spacing.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.lg,
    },
    card: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    button: {
      height: 48,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
    },
    input: {
      height: 48,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
    },
  };