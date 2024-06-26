import { hooks } from 'botframework-webchat-api';
import { type WebChatActivity } from 'botframework-webchat-core';
import React, { Fragment } from 'react';

const { useCreateAttachmentForScreenReaderRenderer, useLocalizer } = hooks;

const ACTIVITY_NUM_ATTACHMENTS_ALT_IDS = {
  few: 'ACTIVITY_NUM_ATTACHMENTS_FEW_ALT',
  many: 'ACTIVITY_NUM_ATTACHMENTS_MANY_ALT',
  one: 'ACTIVITY_NUM_ATTACHMENTS_ONE_ALT',
  other: 'ACTIVITY_NUM_ATTACHMENTS_OTHER_ALT',
  two: 'ACTIVITY_NUM_ATTACHMENTS_TWO_ALT'
};

type LiveRegionAttachmentsProps = Readonly<{
  activity: Readonly<WebChatActivity & { type: 'message' }>;
}>;

// When "renderAttachments" is false, we will not render the content of attachments.
// That means, it will only render "2 attachments", instead of "image attachment".
// This is used in the visual transcript, where we render "Press ENTER to interact."
const LiveRegionAttachments = ({ activity }: LiveRegionAttachmentsProps) => {
  const { attachments = [] } = activity;
  const createAttachmentForScreenReaderRenderer = useCreateAttachmentForScreenReaderRenderer();
  const localizeWithPlural = useLocalizer({ plural: true });

  const attachmentForScreenReaderRenderers = attachments
    .map(attachment => createAttachmentForScreenReaderRenderer({ activity, attachment }))
    .filter(Boolean);

  const numGenericAttachments = attachments.length - attachmentForScreenReaderRenderers.length;

  const numAttachmentsAlt =
    !!numGenericAttachments && localizeWithPlural(ACTIVITY_NUM_ATTACHMENTS_ALT_IDS, numGenericAttachments);

  return (
    <Fragment>
      {attachmentForScreenReaderRenderers.map((render, index) => (
        // Direct Line does not have key for attachment other than index.
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>{typeof render === 'function' && render()}</div>
      ))}
      {numAttachmentsAlt && <p>{numAttachmentsAlt}</p>}
    </Fragment>
  );
};

export default LiveRegionAttachments;

export type { LiveRegionAttachmentsProps };
