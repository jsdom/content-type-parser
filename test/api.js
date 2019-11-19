"use strict";
const MIMEType = require("..");

describe("Smoke tests via README intro example", () => {
  let mimeType;
  beforeEach(() => {
    mimeType = new MIMEType(`Text/HTML;Charset="utf-8"`);
  });

  it("serializes correctly", () => {
    expect(mimeType.toString()).toEqual("text/html;charset=utf-8");
  });

  it("has the correct type, subtype, and essence", () => {
    expect(mimeType.type).toEqual("text");
    expect(mimeType.subtype).toEqual("html");
    expect(mimeType.essence).toEqual("text/html");
  });

  it("has the correct parameters", () => {
    expect(mimeType.parameters.size).toEqual(1);
    expect(mimeType.parameters.has("charset")).toBe(true);
    expect(mimeType.parameters.get("charset")).toEqual("utf-8");
  });

  it("responds to parameter setting", () => {
    mimeType.parameters.set("charset", "windows-1252");
    expect(mimeType.parameters.get("charset")).toEqual("windows-1252");
    expect(mimeType.toString()).toEqual("text/html;charset=windows-1252");
  });
});

describe("Constructor behavior", () => {
  it("converts incoming arguments into strings", () => {
    const arg = {
      toString() {
        return "text/HTML";
      }
    };
    const mimeType = new MIMEType(arg);

    expect(mimeType.toString()).toEqual("text/html");
  });

  it("throws on unparseable MIME types", () => {
    expect(() => new MIMEType("asdf")).toThrow();
    expect(() => new MIMEType("text/html™")).toThrow();
  });
});

describe("static parse() behavior", () => {
  it("converts incoming arguments into strings", () => {
    const arg = {
      toString() {
        return "text/HTML";
      }
    };
    const mimeType = MIMEType.parse(arg);

    expect(mimeType.toString()).toEqual("text/html");
  });

  it("returns null on unparseable MIME types", () => {
    expect(MIMEType.parse("asdf")).toBe(null);
    expect(MIMEType.parse("text/html™")).toBe(null);
  });
});

describe("type manipulation", () => {
  let mimeType;
  beforeEach(() => {
    mimeType = new MIMEType("application/xml;foo=bar");
  });

  it("responds to type being set", () => {
    mimeType.type = "text";
    expect(mimeType.type).toEqual("text");
    expect(mimeType.essence).toEqual("text/xml");
    expect(mimeType.toString()).toEqual("text/xml;foo=bar");
  });

  it("ASCII-lowercases incoming type strings", () => {
    mimeType.type = "TeXT";
    expect(mimeType.type).toEqual("text");
    expect(mimeType.essence).toEqual("text/xml");
    expect(mimeType.toString()).toEqual("text/xml;foo=bar");
  });

  it("converts the value set to a string", () => {
    mimeType.type = {
      toString() {
        return "TeXT";
      }
    };
    expect(mimeType.type).toEqual("text");
    expect(mimeType.essence).toEqual("text/xml");
    expect(mimeType.toString()).toEqual("text/xml;foo=bar");
  });

  it("throws an error for non-HTTP token code points", () => {
    // not exhaustive; maybe later
    expect(() => {
      mimeType.type = "/";
    }).toThrow();
  });

  it("throws an error for an empty string", () => {
    expect(() => {
      mimeType.type = "";
    }).toThrow();
  });
});

describe("subtype manipulation", () => {
  let mimeType;
  beforeEach(() => {
    mimeType = new MIMEType("application/xml;foo=bar");
  });

  it("responds to type being set", () => {
    mimeType.subtype = "pdf";
    expect(mimeType.subtype).toEqual("pdf");
    expect(mimeType.essence).toEqual("application/pdf");
    expect(mimeType.toString()).toEqual("application/pdf;foo=bar");
  });

  it("ASCII-lowercases incoming type strings", () => {
    mimeType.subtype = "PdF";
    expect(mimeType.subtype).toEqual("pdf");
    expect(mimeType.essence).toEqual("application/pdf");
    expect(mimeType.toString()).toEqual("application/pdf;foo=bar");
  });

  it("converts the value set to a string", () => {
    mimeType.subtype = {
      toString() {
        return "PdF";
      }
    };
    expect(mimeType.subtype).toEqual("pdf");
    expect(mimeType.essence).toEqual("application/pdf");
    expect(mimeType.toString()).toEqual("application/pdf;foo=bar");
  });

  it("throws an error for non-HTTP token code points", () => {
    // not exhaustive; maybe later
    expect(() => {
      mimeType.subtype = "/";
    }).toThrow();
  });

  it("throws an error for an empty string", () => {
    expect(() => {
      mimeType.subtype = "";
    }).toThrow();
  });
});

describe("Group-testing functions", () => {
  test("isHTML", () => {
    expect((new MIMEType("text/html")).isHTML()).toBe(true);
    expect((new MIMEType("text/html;charset=utf-8")).isHTML()).toBe(true);
    expect((new MIMEType("text/html;charset=utf-8;foo=bar")).isHTML()).toBe(true);

    expect((new MIMEType("text/xhtml")).isHTML()).toBe(false);
    expect((new MIMEType("application/html")).isHTML()).toBe(false);
    expect((new MIMEType("application/xhtml+xml")).isHTML()).toBe(false);
  });

  test("isXML", () => {
    expect((new MIMEType("application/xml")).isXML()).toBe(true);
    expect((new MIMEType("application/xml;charset=utf-8")).isXML()).toBe(true);
    expect((new MIMEType("application/xml;charset=utf-8;foo=bar")).isXML()).toBe(true);

    expect((new MIMEType("text/xml")).isXML()).toBe(true);
    expect((new MIMEType("text/xml;charset=utf-8")).isXML()).toBe(true);
    expect((new MIMEType("text/xml;charset=utf-8;foo=bar")).isXML()).toBe(true);

    expect((new MIMEType("text/svg+xml")).isXML()).toBe(true);
    expect((new MIMEType("text/svg+xml;charset=utf-8")).isXML()).toBe(true);
    expect((new MIMEType("text/svg+xml;charset=utf-8;foo=bar")).isXML()).toBe(true);

    expect((new MIMEType("application/xhtml+xml")).isXML()).toBe(true);
    expect((new MIMEType("application/xhtml+xml;charset=utf-8")).isXML()).toBe(true);
    expect((new MIMEType("application/xhtml+xml;charset=utf-8;foo=bar")).isXML()).toBe(true);

    expect((new MIMEType("text/xhtml")).isXML()).toBe(false);
    expect((new MIMEType("text/svg")).isXML()).toBe(false);
    expect((new MIMEType("application/html")).isXML()).toBe(false);
    expect((new MIMEType("application/xml+xhtml")).isXML()).toBe(false);
  });

  test("isJavaScript", () => {
    expect((new MIMEType("application/ecmascript")).isJavaScript()).toBe(true);
    expect((new MIMEType("application/javascript")).isJavaScript()).toBe(true);
    expect((new MIMEType("application/x-ecmascript")).isJavaScript()).toBe(true);
    expect((new MIMEType("application/x-javascript")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/ecmascript")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/javascript1.0")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/javascript1.1")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/javascript1.2")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/javascript1.3")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/javascript1.4")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/javascript1.5")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/jscript")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/livescript")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/x-ecmascript")).isJavaScript()).toBe(true);
    expect((new MIMEType("text/x-javascript")).isJavaScript()).toBe(true);

    expect((new MIMEType("text/javascript")).isJavaScript()).toBe(true);

    expect((new MIMEType("text/javascript;charset=utf-8")).isJavaScript()).toBe(false);
    expect((new MIMEType("text/javascript;charset=utf-8")).isJavaScript({ allowParameters: true })).toBe(true);
    expect((new MIMEType("text/javascript;charset=utf-8")).isJavaScript({})).toBe(false);
    expect((new MIMEType("text/javascript;charset=utf-8")).isJavaScript({ allowParameters: false })).toBe(false);

    expect((new MIMEType("text/javascript;charset=utf-8;goal=script")).isJavaScript()).toBe(false);
    expect((new MIMEType("text/javascript;charset=utf-8;goal=script")).isJavaScript({ allowParameters: true }))
      .toBe(true);

    expect((new MIMEType("text/javascript;goal=module")).isJavaScript()).toBe(false);
    expect((new MIMEType("text/javascript;goal=module")).isJavaScript({ allowParameters: true })).toBe(true);
  });

  test("isJSON", () => {
    expect((new MIMEType("application/json")).isJSON()).toBe(true);
    expect((new MIMEType("application/json;charset=utf-8")).isJSON()).toBe(true);
    expect((new MIMEType("application/json;charset=utf-8;foo=bar")).isJSON()).toBe(true);

    expect((new MIMEType("application/ld+json")).isJSON()).toBe(true);
    expect((new MIMEType("application/ld+json;charset=utf-8")).isJSON()).toBe(true);
    expect((new MIMEType("application/ld+json;charset=utf-8;foo=bar")).isJSON()).toBe(true);

    expect((new MIMEType("text/xhtml")).isJSON()).toBe(false);
    expect((new MIMEType("text/svg")).isJSON()).toBe(false);
    expect((new MIMEType("application/html")).isJSON()).toBe(false);
    expect((new MIMEType("application/xml+xhtml")).isJSON()).toBe(false);
  });
});
