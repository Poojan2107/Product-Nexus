import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import ActivityLog from './models/ActivityLog.js';

describe('ActivityLog Model', () => {
  it('fails validation if user is missing', () => {
    const log = new ActivityLog({
      action: 'CREATE',
      entityName: 'Test Asset',
      details: 'Test details'
    });

    const error = log.validateSync();
    expect(error.errors.user).toBeDefined();
  });

  it('fails validation if action is invalid', () => {
    const log = new ActivityLog({
      user: new mongoose.Types.ObjectId(),
      action: 'INVALID_ACTION',
      entityName: 'Test Asset',
      details: 'Test details'
    });

    const error = log.validateSync();
    expect(error.errors.action).toBeDefined();
  });

  it('passes validation with correct fields', () => {
    const log = new ActivityLog({
      user: new mongoose.Types.ObjectId(),
      action: 'UPDATE',
      entityName: 'MacBook Pro',
      details: 'Updated price'
    });

    const error = log.validateSync();
    expect(error).toBeUndefined();
  });
});
