// Mock all native dependencies before any imports
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    setLogLevel: jest.fn(),
    configure: jest.fn(),
    logIn: jest.fn(),
    logOut: jest.fn(),
    getOfferings: jest.fn(),
    getCustomerInfo: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
    addCustomerInfoUpdateListener: jest.fn(),
  },
  LOG_LEVEL: { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        REVENUECAT_API_KEY_APPLE: 'appl_validtestkey1234567890abcdef',
        REVENUECAT_API_KEY_GOOGLE: 'goog_validtestkey1234567890abcdef',
      },
    },
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn((obj: Record<string, unknown>) => obj.ios),
  },
}));

import { revenueCatService } from '../revenueCatService';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const MockPurchases = Purchases as jest.Mocked<typeof Purchases>;
const MockPlatform = Platform as { select: jest.Mock };

// Reset singleton state before every test so each test starts fresh
beforeEach(() => {
  (revenueCatService as any).isInitialized = false;
  // resetAllMocks clears both call history AND implementations (e.g. mockImplementation(() => { throw })
  // from previous tests so they don't bleed into subsequent tests.
  jest.resetAllMocks();
  // Default: act as iOS
  MockPlatform.select.mockImplementation((obj: Record<string, unknown>) => obj.ios);
});

// ─── initialize() ─────────────────────────────────────────────────────────────

describe('initialize()', () => {
  it('calls Purchases.configure with the iOS API key on iOS', async () => {
    await revenueCatService.initialize('user-123');

    expect(MockPurchases.configure).toHaveBeenCalledTimes(1);
    expect(MockPurchases.configure).toHaveBeenCalledWith({
      apiKey: 'appl_validtestkey1234567890abcdef',
      appUserID: 'user-123',
    });
  });

  it('calls Purchases.configure with the Android API key on Android', async () => {
    MockPlatform.select.mockImplementation((obj: Record<string, unknown>) => obj.android);

    await revenueCatService.initialize('user-456');

    expect(MockPurchases.configure).toHaveBeenCalledWith({
      apiKey: 'goog_validtestkey1234567890abcdef',
      appUserID: 'user-456',
    });
  });

  it('calls Purchases.configure with undefined appUserID when no userId given', async () => {
    await revenueCatService.initialize();

    expect(MockPurchases.configure).toHaveBeenCalledWith({
      apiKey: expect.any(String),
      appUserID: undefined,
    });
  });

  it('sets isInitialized to true after successful setup', async () => {
    expect((revenueCatService as any).isInitialized).toBe(false);
    await revenueCatService.initialize();
    expect((revenueCatService as any).isInitialized).toBe(true);
  });

  it('is idempotent — only configures once even if called multiple times', async () => {
    await revenueCatService.initialize('user-1');
    await revenueCatService.initialize('user-2');
    await revenueCatService.initialize('user-3');

    expect(MockPurchases.configure).toHaveBeenCalledTimes(1);
  });

  it('skips initialization when the API key is empty', async () => {
    MockPlatform.select.mockReturnValue('');

    await revenueCatService.initialize();

    expect(MockPurchases.configure).not.toHaveBeenCalled();
    expect((revenueCatService as any).isInitialized).toBe(false);
  });

  it('skips initialization when the API key contains placeholder "xxxx"', async () => {
    MockPlatform.select.mockReturnValue('appl_xxxx_placeholder_key_here');

    await revenueCatService.initialize();

    expect(MockPurchases.configure).not.toHaveBeenCalled();
    expect((revenueCatService as any).isInitialized).toBe(false);
  });

  it('skips initialization when the API key is shorter than 20 chars', async () => {
    MockPlatform.select.mockReturnValue('appl_short');

    await revenueCatService.initialize();

    expect(MockPurchases.configure).not.toHaveBeenCalled();
    expect((revenueCatService as any).isInitialized).toBe(false);
  });

  it('does not throw and leaves isInitialized false when Purchases.configure throws', async () => {
    MockPurchases.configure.mockImplementation(() => { throw new Error('SDK error'); });

    await expect(revenueCatService.initialize()).resolves.toBeUndefined();
    expect((revenueCatService as any).isInitialized).toBe(false);
  });
});

// ─── getOfferings() ───────────────────────────────────────────────────────────

describe('getOfferings()', () => {
  it('returns null and does not call Purchases when not initialized', async () => {
    const result = await revenueCatService.getOfferings();

    expect(result).toBeNull();
    expect(MockPurchases.getOfferings).not.toHaveBeenCalled();
  });

  it('returns the offerings object when initialized', async () => {
    const mockOfferings = {
      current: { identifier: 'default', availablePackages: [] },
      all: { default: { identifier: 'default', availablePackages: [] } },
    };
    MockPurchases.getOfferings.mockResolvedValue(mockOfferings as any);

    await revenueCatService.initialize();
    const result = await revenueCatService.getOfferings();

    expect(MockPurchases.getOfferings).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockOfferings);
  });

  it('returns null (does not throw) when Purchases.getOfferings rejects', async () => {
    MockPurchases.getOfferings.mockRejectedValue(new Error('Network error'));

    await revenueCatService.initialize();
    const result = await revenueCatService.getOfferings();

    expect(result).toBeNull();
  });
});

// ─── getSubscriptionDetails() ─────────────────────────────────────────────────

describe('getSubscriptionDetails()', () => {
  it('returns null and does not call Purchases when not initialized', async () => {
    const result = await revenueCatService.getSubscriptionDetails();

    expect(result).toBeNull();
    expect(MockPurchases.getCustomerInfo).not.toHaveBeenCalled();
  });

  it('returns inactive subscription when no premium_access entitlement exists', async () => {
    MockPurchases.getCustomerInfo.mockResolvedValue({
      entitlements: { active: {} },
    } as any);

    await revenueCatService.initialize();
    const result = await revenueCatService.getSubscriptionDetails();

    expect(result).toEqual({
      hasActiveSubscription: false,
      productIdentifier: null,
      expirationDate: null,
      willRenew: false,
      isInGracePeriod: false,
    });
  });

  it('returns active subscription details when premium_access entitlement exists', async () => {
    const mockEntitlement = {
      productIdentifier: 'com.tefprep.pro.monthly',
      expirationDate: '2026-05-11T00:00:00Z',
      willRenew: true,
    };
    MockPurchases.getCustomerInfo.mockResolvedValue({
      entitlements: {
        active: { premium_access: mockEntitlement },
      },
    } as any);

    await revenueCatService.initialize();
    const result = await revenueCatService.getSubscriptionDetails();

    expect(result).toEqual({
      hasActiveSubscription: true,
      productIdentifier: 'com.tefprep.pro.monthly',
      expirationDate: '2026-05-11T00:00:00Z',
      willRenew: true,
      isInGracePeriod: false,
    });
  });

  it('returns null (does not throw) when getCustomerInfo rejects', async () => {
    MockPurchases.getCustomerInfo.mockRejectedValue(new Error('SDK error'));

    await revenueCatService.initialize();
    const result = await revenueCatService.getSubscriptionDetails();

    expect(result).toBeNull();
  });
});

// ─── purchasePackage() ────────────────────────────────────────────────────────

describe('purchasePackage()', () => {
  const mockPackage = { identifier: 'monthly' } as any;

  it('returns success with customerInfo on a successful purchase', async () => {
    const mockCustomerInfo = { entitlements: { active: {} } };
    MockPurchases.purchasePackage.mockResolvedValue({
      customerInfo: mockCustomerInfo,
    } as any);

    const result = await revenueCatService.purchasePackage(mockPackage);

    expect(result.success).toBe(true);
    expect(result.customerInfo).toEqual(mockCustomerInfo);
  });

  it('throws CANCELLED when the user cancels the purchase', async () => {
    MockPurchases.purchasePackage.mockRejectedValue({ userCancelled: true });

    await expect(revenueCatService.purchasePackage(mockPackage)).rejects.toThrow('CANCELLED');
  });

  it('throws PAYMENT_PENDING on a payment pending error', async () => {
    MockPurchases.purchasePackage.mockRejectedValue({ code: 'PAYMENT_PENDING_ERROR' });

    await expect(revenueCatService.purchasePackage(mockPackage)).rejects.toThrow('PAYMENT_PENDING');
  });

  it('rethrows a generic error message on unknown failures', async () => {
    MockPurchases.purchasePackage.mockRejectedValue(new Error('Something went wrong'));

    await expect(revenueCatService.purchasePackage(mockPackage)).rejects.toThrow(
      'Something went wrong'
    );
  });
});

// ─── identifyUser() ───────────────────────────────────────────────────────────

describe('identifyUser()', () => {
  it('calls Purchases.logIn with the user ID', async () => {
    MockPurchases.logIn.mockResolvedValue({ customerInfo: {} } as any);

    await revenueCatService.identifyUser('firebase-uid-abc');

    expect(MockPurchases.logIn).toHaveBeenCalledWith('firebase-uid-abc');
  });

  it('throws when Purchases.logIn fails', async () => {
    MockPurchases.logIn.mockRejectedValue(new Error('logIn failed'));

    await expect(revenueCatService.identifyUser('uid')).rejects.toThrow('logIn failed');
  });
});

// ─── restorePurchases() ───────────────────────────────────────────────────────

describe('restorePurchases()', () => {
  it('returns customerInfo on success', async () => {
    const mockInfo = { entitlements: { active: { premium_access: {} } } };
    MockPurchases.restorePurchases.mockResolvedValue(mockInfo as any);

    const result = await revenueCatService.restorePurchases();

    expect(result).toEqual(mockInfo);
  });

  it('throws a user-friendly error when restore fails', async () => {
    MockPurchases.restorePurchases.mockRejectedValue(new Error('network'));

    await expect(revenueCatService.restorePurchases()).rejects.toThrow(
      'Failed to restore purchases'
    );
  });
});
