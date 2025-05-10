# Frequently Asked Questions

## General Questions

### What is the Crisis Unleashed Logo System?
The Logo System is a comprehensive set of components, guidelines, and tools for implementing the Crisis Unleashed visual identity across various platforms and contexts.

### Which frameworks does the Logo System support?
The Logo System is primarily built for React and Next.js applications, but also provides vanilla JavaScript implementations and SVG assets for use in any environment.

### Is the Logo System free to use?
Yes, the Logo System is free to use under the terms of our [license](./logo-system-license.md). However, there are some restrictions on commercial usage of the logo assets themselves.

## Technical Questions

### How do I install the Logo System?
\`\`\`bash
npm install @crisis-unleashed/logo-system
\`\`\`
or
\`\`\`bash
yarn add @crisis-unleashed/logo-system
\`\`\`

### What are the minimum requirements?
- React 17.0.0 or higher
- Node.js 14.0.0 or higher
- Modern browser support (no IE11)

### How do I implement a responsive logo?
\`\`\`jsx
import { ResponsiveLogo } from '@crisis-unleashed/logo-system';

function MyComponent() {
  return <ResponsiveLogo variant="primary" />;
}
\`\`\`

### Can I customize the colors of the logos?
Yes, most logo components accept a `colorOverrides` prop that allows you to customize specific colors:

\`\`\`jsx
<FactionLogo 
  faction="cybernetic-nexus" 
  colorOverrides={{
    primary: '#00ff00',
    secondary: '#0000ff'
  }}
/>
\`\`\`

## Usage Questions

### Can I use the logos in my fan art?
Yes, you can use the logos in non-commercial fan art as long as you follow our [fan content guidelines](./fan-content-guidelines.md).

### Can I use the logos on my streaming channel?
Yes, content creators can use the logos when streaming Crisis Unleashed content. Please see our [content creator guidelines](./content-creator-guidelines.md).

### Can I modify the logos for my guild/team?
Limited modifications are allowed for recognized guilds and teams. Please contact us at branding@crisisunleashed.com for approval.

### How do I report misuse of the logos?
If you believe someone is misusing the Crisis Unleashed logos, please contact us at legal@crisisunleashed.com with details.

## Troubleshooting

### The logo animations aren't working in my project
Make sure you've included the required CSS file:
\`\`\`jsx
import '@crisis-unleashed/logo-system/dist/styles.css';
\`\`\`

### The SVG logos aren't displaying correctly
Check that your bundler is configured to handle SVG files correctly. You might need to add an appropriate loader or configuration.

### I'm getting a "Component not found" error
Ensure you're importing from the correct path and that you've installed the package properly. Check the console for more specific error messages.

## Still Have Questions?

If your question isn't answered here, please:
- Check our [documentation](./logo-system.md)
- Join our [Discord community](https://discord.gg/crisisunleashed)
- Contact us at support@crisisunleashed.com
