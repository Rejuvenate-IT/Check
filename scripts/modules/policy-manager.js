/**
 * Simplified Policy Manager for Check
 * Handles only CIPP-related enterprise policies
 * Dramatically simplified from original complex policy system
 */

import logger from "../utils/logger.js";

export class PolicyManager {
  constructor() {
    this.cippPolicies = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      await this.loadCippPolicies();
      this.isInitialized = true;
      logger.log("Check: CIPP policy manager initialized successfully");
    } catch (error) {
      logger.error("Check: Failed to initialize CIPP policy manager:", error);
      throw error;
    }
  }

  async loadPolicies() {
    // Backward compatibility - delegate to loadCippPolicies
    return await this.loadCippPolicies();
  }

  async loadCippPolicies() {
    try {
      // Safe wrapper for chrome.* operations
      const safe = async (promise) => {
        try { return await promise; } catch(_) { return {}; }
      };
      
      // Load enterprise policies from managed storage (only CIPP settings)
      const managedPolicies = await safe(chrome.storage.managed.get([
        "enableCippReporting",
        "cippServerUrl",
        "cippTenantId"
      ]));

      // Set CIPP policies with defaults
      this.cippPolicies = {
        enableCippReporting: managedPolicies.enableCippReporting || false,
        cippServerUrl: managedPolicies.cippServerUrl || "",
        cippTenantId: managedPolicies.cippTenantId || ""
      };

      logger.log("Check: CIPP policies loaded successfully");
    } catch (error) {
      logger.error("Check: Failed to load CIPP policies:", error);
      this.loadDefaultCippPolicies();
    }
  }

  loadDefaultCippPolicies() {
    this.cippPolicies = {
      enableCippReporting: false,
      cippServerUrl: "",
      cippTenantId: ""
    };
    logger.log("Check: Using default CIPP policies");
  }

  async getPolicies() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.cippPolicies;
  }

  async getCippPolicies() {
    return this.getPolicies();
  }

  async isCippReportingEnabled() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.cippPolicies.enableCippReporting;
  }

  async getCippServerUrl() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.cippPolicies.cippServerUrl;
  }

  async getCippTenantId() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.cippPolicies.cippTenantId;
  }

  async refreshPolicies() {
    this.cippPolicies = null;
    this.isInitialized = false;
    return await this.initialize();
  }

  // Simplified policy check for compatibility
  async checkPolicy(action, context = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // For now, allow all actions since we only manage CIPP settings
    // CIPP settings are handled in the configuration, not as policy checks
    return {
      allowed: true,
      reason: "CIPP-only policy manager allows all actions",
      requiresConfirmation: false,
      restrictions: []
    };
  }

  // Simplified policy check - only validates CIPP configuration
  async validateCippConfiguration() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const validation = {
      isValid: true,
      errors: []
    };

    // If CIPP reporting is enabled, validate required settings
    if (this.cippPolicies.enableCippReporting) {
      if (!this.cippPolicies.cippServerUrl) {
        validation.isValid = false;
        validation.errors.push("CIPP Server URL is required when CIPP reporting is enabled");
      }

      if (!this.cippPolicies.cippTenantId) {
        validation.isValid = false;
        validation.errors.push("CIPP Tenant ID is required when CIPP reporting is enabled");
      }

      // Basic URL validation
      if (this.cippPolicies.cippServerUrl) {
        try {
          new URL(this.cippPolicies.cippServerUrl);
        } catch (error) {
          validation.isValid = false;
          validation.errors.push("CIPP Server URL is not a valid URL");
        }
      }
    }

    return validation;
  }
}
