// Responsive Design Utilities
export const breakpoints = {
  mobile: '393px',    // iPhone 16
  tablet: '768px',    // iPad
  desktop: '1024px',  // Desktop
  large: '1280px',    // Large Desktop
  xl: '1536px'        // Extra Large
};

export const responsiveClasses = {
  // Container classes
  container: 'w-full max-w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
  
  // Typography classes
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold',
  h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium',
  body: 'text-sm sm:text-base md:text-lg',
  small: 'text-xs sm:text-sm',
  
  // Button classes
  button: 'h-12 sm:h-14 md:h-16 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-medium',
  buttonSmall: 'h-10 sm:h-12 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium',
  
  // Grid classes
  grid1: 'grid grid-cols-1 gap-4 sm:gap-6',
  grid2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  grid4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  
  // Flex classes
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-col sm:flex-row',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex flex-col sm:flex-row sm:items-center sm:justify-between',
  
  // Spacing classes
  section: 'mb-6 sm:mb-8 md:mb-12',
  card: 'p-4 sm:p-6 md:p-8',
  cardSmall: 'p-3 sm:p-4 md:p-6',
  
  // Form classes
  input: 'h-12 sm:h-14 px-3 sm:px-4 text-sm sm:text-base',
  select: 'h-12 sm:h-14 px-3 sm:px-4 text-sm sm:text-base',
  textarea: 'p-3 sm:p-4 text-sm sm:text-base min-h-[100px] sm:min-h-[120px]',
  
  // Modal classes
  modal: 'w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4',
  modalContent: 'p-4 sm:p-6 md:p-8',
  
  // Navigation classes
  nav: 'px-4 sm:px-6 md:px-8 py-3 sm:py-4',
  navItem: 'px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base',
  
  // List classes
  list: 'space-y-2 sm:space-y-3 md:space-y-4',
  listItem: 'p-3 sm:p-4 md:p-6',
  
  // Table classes
  table: 'w-full text-sm sm:text-base',
  tableCell: 'px-2 sm:px-3 md:px-4 py-2 sm:py-3',
  tableHeader: 'px-2 sm:px-3 md:px-4 py-3 sm:py-4 font-medium',
};

export const getResponsiveValue = (mobile: any, tablet?: any, desktop?: any, large?: any) => {
  return {
    mobile,
    tablet: tablet || mobile,
    desktop: desktop || tablet || mobile,
    large: large || desktop || tablet || mobile
  };
};

export const responsiveConfig = {
  // Common responsive patterns
  patterns: {
    // Card layout
    card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8',
    
    // Button variants
    buttonPrimary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-colors',
    buttonSecondary: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors',
    buttonOutline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors',
    
    // Input styles
    input: 'border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
    inputError: 'border-red-500 focus:ring-red-500',
    
    // Section headers
    sectionHeader: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6',
    sectionTitle: 'text-xl sm:text-2xl font-bold text-gray-900',
    
    // Loading states
    loading: 'flex items-center justify-center p-8',
    skeleton: 'animate-pulse bg-gray-200 rounded',
    
    // Empty states
    empty: 'text-center py-12 text-gray-500',
    emptyIcon: 'mx-auto h-12 w-12 text-gray-400 mb-4',
    
    // Error states
    error: 'text-center py-8 text-red-600 bg-red-50 rounded-lg',
    errorIcon: 'mx-auto h-8 w-8 text-red-500 mb-2',
  },
  
  // Component-specific responsive classes
  components: {
    // Navigation
    navbar: {
      container: 'bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8',
      logo: 'h-8 sm:h-10 md:h-12',
      menu: 'hidden sm:flex space-x-4 md:space-x-8',
      mobileMenu: 'sm:hidden',
      menuItem: 'px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-[var(--color-primary)]',
    },
    
    // Cards
    card: {
      container: 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
      header: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-gray-200',
      body: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6',
      footer: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200',
    },
    
    // Forms
    form: {
      container: 'space-y-4 sm:space-y-6',
      group: 'space-y-2',
      label: 'block text-sm sm:text-base font-medium text-gray-700',
      input: 'w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
      error: 'text-sm text-red-600 mt-1',
      help: 'text-sm text-gray-500 mt-1',
    },
    
    // Tables
    table: {
      container: 'overflow-x-auto',
      table: 'min-w-full divide-y divide-gray-200',
      header: 'bg-gray-50',
      headerCell: 'px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider',
      row: 'bg-white hover:bg-gray-50',
      cell: 'px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900',
    },
    
    // Modals
    modal: {
      overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6',
      container: 'bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl w-full max-h-[90vh] overflow-y-auto',
      header: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-gray-200',
      body: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6',
      footer: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4',
    },
  }
};

export default responsiveConfig; 