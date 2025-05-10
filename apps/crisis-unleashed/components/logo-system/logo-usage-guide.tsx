import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LogoVariant from "./logo-variant" // Import directly from the file

export function LogoUsageGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Usage Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Standard Logo</h3>
          <p>
            Use the standard logo for most applications where space permits. This is the primary logo representation.
          </p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="standard" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Compact Logo</h3>
          <p>
            Use the compact logo in spaces where the standard logo would be too large but you still need both icon and
            text.
          </p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="compact" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Horizontal Logo</h3>
          <p>Use the horizontal logo in headers and navigation bars where horizontal space is available.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="horizontal" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Vertical Logo</h3>
          <p>Use the vertical logo in narrow spaces or for decorative purposes where vertical space is available.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="vertical" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Icon-Only Logo</h3>
          <p>Use the icon-only logo for app icons, favicons, and small UI elements where text would be illegible.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="icon-only" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Text-Only Logo</h3>
          <p>
            Use the text-only logo when the icon is displayed separately or when you need to emphasize the brand name.
          </p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="text-only" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Footer Logo</h3>
          <p>Use the footer logo in website footers, typically in a more subtle presentation.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="footer" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mobile Logo</h3>
          <p>Use the mobile logo for mobile navigation and small screen contexts.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="mobile" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Print Logo</h3>
          <p>Use the print logo for printed materials, ensuring high contrast and readability.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="print" size="lg" monochrome />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Watermark Logo</h3>
          <p>Use the watermark logo as a subtle background element or for document watermarking.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoVariant variant="watermark" size="lg" />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Logo Spacing</h3>
          <p>
            Always maintain adequate spacing around the logo. The minimum clear space should be equal to the height of
            the "C" in "CRISIS".
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Logo Misuse</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Do not stretch or distort the logo</li>
            <li>Do not change the logo colors outside of approved faction themes</li>
            <li>Do not place the logo on busy backgrounds without proper contrast</li>
            <li>Do not rotate or tilt the logo</li>
            <li>Do not add effects like shadows or glows unless part of an approved animation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default LogoUsageGuide
