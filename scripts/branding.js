/**
 * Hardcoded Branding Module for Check
 * Contains Rejuvenate IT branding configuration as hardcoded values
 * Eliminates the need to load external branding configuration files
 */

/**
 * Get the hardcoded branding configuration
 * @returns {Object} The complete branding configuration object
 */
export function getBranding() {
  return {
    companyName: "Rejuvenate IT",
    companyURL: "https://rejuvenate.it/",
    productName: "LoginCheck",
    primaryColor: "#1D3465",
    logoUrl: "https://rejuvenateassets.blob.core.windows.net/check-logo/tittle-48-48.png",
    supportEmail: "service@rejuvenate.it",
    version: "1.0.4",
    description: "Protect against phishing attacks targeting Microsoft 365 login pages",
    branding: {
      primaryColor: "#1D3465",
      primaryHover: "#3A5A8B",
      primaryLight: "rgba(29, 52, 101, 0.1)",
      primaryDark: "#162A52",
      secondaryColor: "#003049",
      secondaryHover: "#004B73",
      secondaryLight: "rgba(0, 48, 73, 0.1)",
      secondaryDark: "#002236",
      accentColor: "#005C63",
      successColor: "#005C63",
      warningColor: "#F77F00",
      errorColor: "#DC2626",
      textPrimary: "#FFFFFF",
      textSecondary: "#9CA3AF",
      textMuted: "#6B7280",
      textInverse: "#003049",
      bgPrimary: "#003049",
      bgSecondary: "rgba(255, 255, 255, 0.05)",
      bgSurface: "rgba(255, 255, 255, 0.03)",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "rgba(29, 52, 101, 0.3)"
    },
    assets: {
      logoUrl: "https://rejuvenateassets.blob.core.windows.net/check-logo/tittle-48-48.png",
      iconUrl: "images/tittle-32-32.png",
      faviconUrl: "images/tittle-16-16.png",
      bannerUrl: "images/banner.png",
      screenshotUrls: [
        "images/screenshot1.png",
        "images/screenshot2.png",
        "images/screenshot3.png"
      ]
    },
    customization: {
      showCompanyBranding: false,
      allowUserCustomization: false,
      enableWhiteLabeling: false,
      customCssEnabled: true,
      customIconsEnabled: true
    },
    features: {
      welcomeMessage: "Welcome to LoginCheck, the Microsoft 365 Phishing Protection tool provided by Rejuvenate IT",
      tagline: "Advanced phishing detection for Microsoft 365 login pages provided by Rejuvenate IT",
      securityBadgeText: "Protected by Rejuvenate IT",
      blockedPageTitle: "Phishing Attempt Blocked by Rejuvenate IT",
      blockedPageMessage: "This page appears to be a phishing attempt targeting Microsoft 365 credentials. Rejuvenate IT has blocked access to protect your company. Please contact the Support Team on 01202 237 275."
    },
    customText: {
      extensionDescription: "LoginCheck provides enterprise-grade detection and blocking of phishing attempts targeting Microsoft 365 login pages, with comprehensive policy management and audit capabilities.",
      securityFeatures: [
        "Real-time Microsoft 365 phishing detection",
        "Advanced login page verification",
        "Cryptographic verification badges",
        "Enterprise policy enforcement",
        "Comprehensive security audit logging",
        "Custom detection rules engine"
      ],
      enterpriseFeatures: [
        "Group Policy (GPO) support",
        "Microsoft Intune integration",
        "Centralized management console",
        "Security compliance reporting",
        "Custom phishing detection rules",
        "24/7 enterprise security support"
      ]
    },
    socialMedia: {
      twitter: "#",
      linkedin: "https://uk.linkedin.com/company/rejuvenate-it",
      youtube: "#",
      github: "https://github.com/Rejuvenate-IT"
    },
    whiteLabel: {
      enabled: true,
      allowCustomColors: true,
      allowCustomLogos: true,
      allowCustomText: true,
      allowCustomIcons: true,
      allowCustomCss: true,
      preserveAttribution: false,
      customizableElements: [
        "extension_name",
        "company_name",
        "logo",
        "colors",
        "contact_info",
        "support_links",
        "custom_css"
      ]
    },
    licensing: {
      licenseKey: "",
      licensedTo: "",
      licenseType: "enterprise",
      licenseExpiry: null,
      maxUsers: null,
      features: [
        "unlimited_users",
        "white_labeling",
        "enterprise_support",
        "compliance_reporting",
        "custom_rules",
        "api_access"
      ]
    },
    deployment: {
      supportedPlatforms: [
        "Chrome",
        "Chromium",
        "Microsoft Edge",
        "Brave",
        "Opera"
      ],
      minimumVersion: "88",
      manifestVersion: 3,
      deploymentMethods: [
        "Group Policy (GPO)",
        "Microsoft Intune",
        "Chrome Enterprise",
        "Manual Installation"
      ]
    },
    analytics: {
      enabled: false,
      trackingId: "",
      events: [
        "extension_installed",
        "threat_blocked",
        "page_scanned",
        "settings_changed"
      ],
      anonymizeData: true,
      respectDoNotTrack: true
    },
    updates: {
      autoUpdateEnabled: true,
      updateChannel: "stable",
      updateCheckInterval: 86400000
    },
    metadata: {
      created: "2024-01-01T00:00:00Z",
      modified: "2024-01-01T00:00:00Z",
      author: "Check Technologies",
      maintainer: "service@rejuvenate.it",
      schema_version: "1.0"
    }
  };
}

/**
 * Default branding configuration fallback
 * Used if hardcoded branding somehow fails
 * @returns {Object} Minimal branding configuration
 */
export function getDefaultBranding() {
  return {
    companyName: "Check",
    productName: "Check",
    version: "1.0.0",
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    logoUrl: "images/logo.png",
    faviconUrl: "images/favicon.ico",
    supportEmail: "support@check.com",
    supportUrl: "https://support.check.com",
    privacyPolicyUrl: "https://check.com/privacy",
    termsOfServiceUrl: "https://check.com/terms",
    welcomeMessage: "Welcome to Check - Your Enterprise Web Security Solution",
    blockedPageTitle: "Access Blocked by Check",
    blockedPageMessage: "This page has been blocked by your organization's security policy.",
    showCompanyBranding: true,
    licenseKey: "",
    licensedTo: "",
    licenseExpiry: null
  };
}