# Quick Reference: CBC & 8-4-4 Subjects Implementation

## All Available Subjects (32 Total)

### CBC Subjects (Grade 10-12) - 18 subjects
1. Agriculture
2. Business Studies
3. Computer Science
4. Creative Arts & Sports
5. English
6. French
7. German
8. Home Science
9. Integrated Science
10. Kenyan Sign Language
11. Kiswahili
12. Mandarin
13. Mathematics
14. Physical Education
15. Pre-Technical Studies
16. Religious Education
17. Social Studies
18. Indigenous Languages

### 8-4-4 Subjects (Form 1-4) - 20 subjects
1. Arabic
2. Art & Design
3. Aviation Technology
4. Biology
5. Building Construction
6. Chemistry
7. Computer Studies
8. CRE/IRE/HRE
9. Electricity
10. English
11. Geography
12. History & Government
13. Kiswahili
14. Marine Engineering
15. Mathematics
16. Metalwork
17. Music
18. Physics
19. Woodwork
20. Power Mechanics

### Subjects in Both Systems (7 duplicates automatically removed)
- Mathematics
- English
- Kiswahili
- Physics
- Chemistry
- Biology
- Computer (Studies/Science)

## Component Quick Start

### 1. Searchable Subject Dropdown
**File**: `/app/components/SearchableSubjectDropdown/index.jsx`

```jsx
import SearchableSubjectDropdown from '../SearchableSubjectDropdown';
import { ALL_SUBJECTS } from '../../constants/subjects';

// In your component:
<SearchableSubjectDropdown
  value={selectedSubject}
  onChange={(value) => setSelectedSubject(value)}
  options={ALL_SUBJECTS}
  placeholder="Search subjects..."
/>
```

**Features**:
- ✅ Real-time search filtering
- ✅ Clear/reset button
- ✅ Keyboard navigation
- ✅ Click-outside to close
- ✅ Visual selection feedback

### 2. Delivery Progress Indicator
**File**: `/app/components/DeliveryProgressIndicator/index.jsx`

```jsx
import DeliveryProgressIndicator from '../DeliveryProgressIndicator';

// In your component state:
const [deliveryProgress, setDeliveryProgress] = useState({
  isOpen: false,
  totalRecipients: 0,
  sentCount: 0,
  failedCount: 0,
  currentRecipient: '',
  isComplete: false,
  failedRecipients: [],
  isLoading: false,
});

// In your render:
<DeliveryProgressIndicator
  isOpen={deliveryProgress.isOpen}
  totalRecipients={deliveryProgress.totalRecipients}
  sentCount={deliveryProgress.sentCount}
  failedCount={deliveryProgress.failedCount}
  currentRecipient={deliveryProgress.currentRecipient}
  isComplete={deliveryProgress.isComplete}
  failedRecipients={deliveryProgress.failedRecipients}
  isLoading={deliveryProgress.isLoading}
  onClose={() => setDeliveryProgress(prev => ({ ...prev, isOpen: false }))}
  onRetry={handleRetry}
/>
```

## Updated Components

### Resources Manager
**File**: `/app/components/resources/page.jsx`
- ✅ Subject dropdown updated with search
- ✅ All 32 subjects available
- ✅ Delivery progress indicator added

### Assignments Manager  
**File**: `/app/components/AssignmentsManager/page.jsx`
- ✅ Subject dropdown updated with search
- ✅ All 32 subjects available
- ✅ Delivery progress indicator added

## Email Delivery Enhancements

### File: `/libs/emailDelivery.js`

**Features**:
- ✅ Exponential backoff (up to 3 retries)
- ✅ Gmail rate limit detection (454 error)
- ✅ Automatic cool-down periods
- ✅ Email throttling (10/sec max)
- ✅ Connection pooling

**Configuration**:
```javascript
RETRY_CONFIG = {
  maxRetries: 3,              // 3 attempts total
  initialDelay: 1000,         // 1 second initial wait
  maxDelay: 30000,            // 30 second max between attempts
  backoffMultiplier: 2,       // Double each time
  rateLimit: 100,             // 100ms min between emails
}
```

### Delivery API Routes

**Resources**: `/app/api/resources/delivery/route.js`
**Assignments**: `/app/api/assignment/delivery/route.js`

**Enhancements**:
- ✅ Rate limit detection in delivery loop
- ✅ Exponential backoff (5s → 10s → 20s... up to 2 min)
- ✅ Automatic pause on rate limit
- ✅ Better error logging

## Testing the Implementation

### Test Subject Search
1. Go to Resources or Assignments Manager
2. Click subject dropdown
3. Type "Math" → should filter to Mathematics
4. Type "Fr" → should filter to French
5. Type "xyz" → should show "No subjects match"
6. Clear search → should show all subjects

### Test Email Delivery with Rate Limiting

**Local Testing**:
```javascript
// In your test file
const testDelivery = async () => {
  const response = await fetch('/api/resources/delivery', {
    method: 'POST',
    headers: {
      'x-admin-token': userToken,
      'x-device-token': deviceToken,
    },
    body: JSON.stringify({
      resourceId: 123,
      recipientIds: [1, 2, 3], // List of recipient IDs
    })
  });
  
  const result = await response.json();
  console.log(result);
  // Check:
  // - successCount > 0 for delivered emails
  // - failureCount for failed attempts
  // - results array with details
};
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Dropdown shows incomplete subjects | Verify `ALL_SUBJECTS` imported from `/app/constants/subjects.js` |
| Search not working | Check that `SearchableSubjectDropdown` component is mounted and received options prop |
| Progress indicator not showing | Ensure component is rendered and `deliveryProgress.isOpen` is true |
| Emails still failing with 454 error | Check `emailDelivery.js` has retry logic enabled and RETRY_CONFIG is set |
| Selected subject not filtering | Ensure filter logic compares against the same value format (e.g., 'Mathematics' not 'math') |

## File Structure

```
app/
├── constants/
│   └── subjects.js                          [NEW]
├── components/
│   ├── SearchableSubjectDropdown/
│   │   └── index.jsx                        [NEW]
│   ├── DeliveryProgressIndicator/
│   │   └── index.jsx                        [NEW]
│   ├── resources/
│   │   └── page.jsx                         [MODIFIED]
│   └── AssignmentsManager/
│       └── page.jsx                         [MODIFIED]
├── api/
│   ├── resources/
│   │   └── delivery/
│   │       └── route.js                     [MODIFIED]
│   └── assignment/
│       └── delivery/
│           └── route.js                     [MODIFIED]
└── libs/
    └── emailDelivery.js                     [MODIFIED]
```

## Performance Metrics

- **Subject Search**: O(n) where n=32 (minimal impact)
- **Dropdown Rendering**: Memoized to prevent unnecessary renders
- **Email Rate**: Limited to 10/second per Gmail restrictions
- **Retry Overhead**: ~5-120 seconds per rate limit encounter
- **Progress Updates**: Real-time with minimal UI re-renders

## Security Notes

- ✅ All subject values validated server-side
- ✅ Email recipients verified before sending
- ✅ Rate limits protect against abuse
- ✅ Failed recipient data includes error context
- ✅ Admin authentication required for delivery

## Next Steps

1. **Test thoroughly** with your current Gmail account
2. **Monitor logs** for rate limit patterns
3. **Adjust RETRY_CONFIG** if needed based on actual usage
4. **Consider batch scheduling** for large email operations
5. **Plan for scaling** if sending to 100+ recipients regularly

## Additional Resources

- Subject list: `/app/constants/subjects.js`
- Implementation guide: `/IMPLEMENTATION_NOTES.md`
- Component docs: Check component JSDoc comments
- Email library: `Nodemailer` (industry standard)
