/**
 * Configuration Manager for Check
 * Handles enterprise configuration and settings management
 */

import logger from "../utils/logger.js";

export class ConfigManager {
  constructor() {
    this.config = null;
    this.enterpriseConfig = null;
  }

  async loadConfig() {
    try {
      // Safe wrapper for chrome.* operations
      const safe = async (promise) => {
        try {
          return await promise;
        } catch (_) {
          return {};
        }
      };

      // Load enterprise configuration from managed storage (GPO/Intune)
      this.enterpriseConfig = await this.loadEnterpriseConfig();

      // Load local configuration with safe wrapper
      const localConfig = await safe(chrome.storage.local.get(["config"]));

      // Merge configurations with enterprise taking precedence
      this.config = this.mergeConfigurations(
        localConfig?.config,
        this.enterpriseConfig
      );

      logger.log("Check: Configuration loaded successfully");
      return this.config;
    } catch (error) {
      logger.error("Check: Failed to load configuration:", error);
      throw error;
    }
  }

  async loadEnterpriseConfig() {
    try {
      // Safe wrapper for chrome.* operations
      const safe = async (promise) => {
        try {
          return await promise;
        } catch (_) {
          return {};
        }
      };

      // Check if we're in development mode for mock policies
      const isDevelopment = this.isDevelopmentMode();

      // Check if enterprise simulation mode is enabled (dev only)
      let simulateEnterpriseMode = false;
      if (isDevelopment) {
        const simulateMode = await safe(
          chrome.storage.local.get(["simulateEnterpriseMode"])
        );
        simulateEnterpriseMode = simulateMode?.simulateEnterpriseMode || false;
      }

      if (isDevelopment && simulateEnterpriseMode) {
        // Return mock enterprise configuration for development/testing
        logger.log(
          "Check: Using mock enterprise configuration (simulate mode enabled)"
        );
        return {
          // Extension configuration
          showNotifications: true,
          enableValidPageBadge: true,
          enablePageBlocking: true,
          enableCippReporting: false,
          cippServerUrl: "",
          cippTenantId: "",
          customRulesUrl:
            "https://raw.githubusercontent.com/CyberDrain/ProjectX/refs/heads/main/rules/detection-rules.json",
          updateInterval: 24,
          enableDebugLogging: false,
          // Note: enableDeveloperConsoleLogging is not policy-managed - remains under user control

          // Custom branding (matches managed_schema.json structure)
          customBranding: {
            companyName: "CyberDrain",
            productName: "Check Enterprise",
            primaryColor: "#F77F00",
            logoUrl:
              "https://cyberdrain.com/images/favicon_hu_20e77b0e20e363e.png",
          },
        };
      }

      // Attempt to load from managed storage (deployed via GPO/Intune)
      const managedConfig = await safe(chrome.storage.managed.get(null));

      if (managedConfig && Object.keys(managedConfig).length > 0) {
        logger.log("Check: Enterprise configuration found");
        return managedConfig;
      }

      return {};
    } catch (error) {
      logger.log("Check: No enterprise configuration available");
      return {};
    }
  }

  isDevelopmentMode() {
    // Check if we're in development mode
    // This could be based on environment, hostname, or other indicators
    try {
      // Check if we're running in an extension context and in development
      const manifestData = chrome.runtime.getManifest();
      const isDev = !("update_url" in manifestData); // No update_url means unpacked extension
      return isDev;
    } catch (error) {
      return false;
    }
  }

  mergeConfigurations(localConfig, enterpriseConfig) {
    const defaultConfig = this.getDefaultConfig();

    // Start with defaults and local config
    let merged = {
      ...defaultConfig,
      ...localConfig,
    };

    // Handle CIPP settings from enterprise config (highest precedence)
    if (enterpriseConfig) {
      // CIPP settings always come from enterprise config if present
      if (enterpriseConfig.enableCippReporting !== undefined) {
        merged.enableCippReporting = enterpriseConfig.enableCippReporting;
      }
      if (enterpriseConfig.cippServerUrl) {
        merged.cippServerUrl = enterpriseConfig.cippServerUrl;
      }
      if (enterpriseConfig.cippTenantId) {
        merged.cippTenantId = enterpriseConfig.cippTenantId;
      }
    }

    return merged;
  }

  getDefaultConfig() {
    return {
      // Extension settings
      extensionEnabled: true,
      debugMode: false,

      // Security settings
      blockMaliciousUrls: true,
      blockPhishingAttempts: true,
      enableContentManipulation: true,
      enableUrlMonitoring: true,

      // Detection settings
      detectionRules: {
        enableCustomRules: true,
        customRulesUrl:
          "https://raw.githubusercontent.com/Rejuvenate-IT/Check/refs/heads/main/rules/detection-rules.json",
        updateInterval: 86400000, // 24 hours
        strictMode: false,
      },

      // UI settings
      showNotifications: true,
      notificationDuration: 5000,
      enableValidPageBadge: true,
      enablePageBlocking: true,

      // Debug settings
      enableDebugLogging: false,

      // Custom rules
      customRulesUrl: "",
      updateInterval: 24, // hours

      // Performance settings
      scanDelay: 100,
      maxScanDepth: 10,

      // Allow/Deny lists
      allowlistedDomains: [],
      denylistedDomains: [],

      // Enterprise features
      enterpriseMode: false,
      centralManagement: false,
      reportingEndpoint: "",

      // CIPP integration
      enableCippReporting: false,
      cippServerUrl: "",
      cippTenantId: "",

      // Feature flags
      features: {
        urlBlocking: true,
        contentInjection: true,
        realTimeScanning: true,
        behaviorAnalysis: false,
      },
    };
  }


  async setDefaultConfig() {
    try {
      // Safe wrapper for chrome.* operations
      const safe = async (promise) => {
        try {
          return await promise;
        } catch (_) {
          return undefined;
        }
      };

      const defaultConfig = this.getDefaultConfig();
      await safe(chrome.storage.local.set({ config: defaultConfig }));
      this.config = defaultConfig;
    } catch (error) {
      logger.error("Check: Failed to set default config:", error);
      this.config = this.getDefaultConfig();
    }
  }

  async updateConfig(updates) {
    try {
      // Safe wrapper for chrome.* operations
      const safe = async (promise) => {
        try {
          return await promise;
        } catch (_) {
          return undefined;
        }
      };

      const currentConfig = await this.getConfig();
      const updatedConfig = { ...currentConfig, ...updates };

      // Validate that enterprise-enforced policies are not being modified
      if (this.enterpriseConfig?.enforcedPolicies) {
        Object.keys(this.enterpriseConfig.enforcedPolicies).forEach(
          (policy) => {
            if (
              this.enterpriseConfig.enforcedPolicies[policy]?.locked &&
              updates[policy] !== undefined &&
              updates[policy] !== this.enterpriseConfig[policy]
            ) {
              throw new Error(
                `Policy '${policy}' is locked by enterprise configuration`
              );
            }
          }
        );
      }

      await safe(chrome.storage.local.set({ config: updatedConfig }));
      this.config = updatedConfig;

      // Notify other components of configuration change with safe wrapper
      try {
        chrome.runtime.sendMessage(
          {
            type: "CONFIG_UPDATED",
            config: updatedConfig,
          },
          () => {
            if (chrome.runtime.lastError) {
              // Silently handle errors
            }
          }
        );
      } catch (error) {
        // Silently handle errors
      }

      return updatedConfig;
    } catch (error) {
      logger.error("Check: Failed to update configuration:", error);
      throw error;
    }
  }

  async getConfig() {
    if (!this.config) {
      await this.loadConfig();
    }
    return this.config;
  }

  async refreshConfig() {
    this.config = null;
    this.enterpriseConfig = null;
    return await this.loadConfig();
  }

  async migrateConfig(previousVersion) {
    try {
      // Safe wrapper for chrome.* operations
      const safe = async (promise) => {
        try {
          return await promise;
        } catch (_) {
          return {};
        }
      };

      logger.log(
        `Check: Migrating configuration from version ${previousVersion}`
      );

      const currentConfig = await safe(chrome.storage.local.get(["config"]));
      if (!currentConfig?.config) return;

      // Add migration logic here for future versions
      // Example:
      // if (this.isVersionLessThan(previousVersion, '1.1.0')) {
      //   // Migration logic for 1.1.0
      // }

      logger.log("Check: Configuration migration completed");
    } catch (error) {
      logger.error("Check: Configuration migration failed:", error);
    }
  }

  isVersionLessThan(version1, version2) {
    const v1Parts = version1.split(".").map(Number);
    const v2Parts = version2.split(".").map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part < v2Part) return true;
      if (v1Part > v2Part) return false;
    }

    return false;
  }

  // Utility methods for enterprise deployment
  async exportConfiguration() {
    const config = await this.getConfig();
    const exportData = {
      config,
      timestamp: new Date().toISOString(),
      version: chrome.runtime.getManifest().version,
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importConfiguration(configJson) {
    try {
      const importData = JSON.parse(configJson);

      // Validate import data
      if (!importData.config) {
        throw new Error("Invalid configuration format");
      }

      // Update configuration
      await this.updateConfig(importData.config);

      logger.log("Check: Configuration imported successfully");
      return true;
    } catch (error) {
      logger.error("Check: Failed to import configuration:", error);
      throw error;
    }
  }

  /**
   * Get final branding configuration by merging hardcoded branding with managed overrides
   * This method is called by background script to provide branding to options page
   */
  async getFinalBrandingConfig() {
    try {
      // Import hardcoded branding from branding.js
      const brandingModule = await import('../branding.js');
      const hardcodedBranding = brandingModule.getBranding();

      // Get enterprise configuration for potential branding overrides
      const enterpriseConfig = await this.loadEnterpriseConfig();

      // Start with hardcoded branding
      let finalBranding = { ...hardcodedBranding };

      // Apply enterprise branding overrides if present
      if (enterpriseConfig?.customBranding) {
        logger.log("ConfigManager: Applying enterprise branding overrides");
        finalBranding = {
          ...finalBranding,
          ...enterpriseConfig.customBranding
        };
      }

      logger.log("ConfigManager: Final branding configuration:", {
        companyName: finalBranding.companyName,
        productName: finalBranding.productName,
        primaryColor: finalBranding.primaryColor,
        source: enterpriseConfig?.customBranding ? 'enterprise-override' : 'hardcoded'
      });

      return finalBranding;
    } catch (error) {
      logger.error("ConfigManager: Failed to get final branding config:", error);
      
      // Fallback to hardcoded branding only
      try {
        const brandingModule = await import('../branding.js');
        const fallbackBranding = brandingModule.getBranding();
        logger.log("ConfigManager: Using hardcoded branding fallback");
        return fallbackBranding;
      } catch (fallbackError) {
        logger.error("ConfigManager: Failed to load fallback branding:", fallbackError);
        
        // Final fallback to prevent complete failure
        return {
          companyName: "Rejuvenate IT",
          productName: "LoginCheck",
          primaryColor: "#1D3465",
          logoUrl: "https://rejuvenateassets.blob.core.windows.net/check-logo/tittle-48-48.png"
        };
      }
    }
  }
}
