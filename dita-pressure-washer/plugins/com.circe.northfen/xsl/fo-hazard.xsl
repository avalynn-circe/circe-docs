<?xml version="1.0" encoding="UTF-8"?>
<!-- PDF twin of html5-hazard.xsl: a NOTICE without its own hazardsymbol
     renders as a one-column panel with no safety alert symbol. -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                version="3.0"
                exclude-result-prefixes="xs">

  <!-- The toolkit leaves the text column of a hazard panel without a width.
       FOP then gives that column the whole table width, so the text runs past
       the right edge by the width of the symbol column. This wrapper copies the
       toolkit's panel and gives any column without a width the space left over. -->
  <xsl:template match="*[contains(@class, ' hazard-d/hazardstatement ')]" priority="5">
    <xsl:variable name="panel">
      <xsl:next-match/>
    </xsl:variable>
    <xsl:apply-templates select="$panel" mode="northfen-fix-columns"/>
  </xsl:template>

  <!-- The toolkit sets keep-together="always" on the message cell. That
       shorthand also stops lines from breaking, so long sentences ran off the
       page. Keep the panel on one page but let its lines wrap. -->
  <xsl:attribute-set name="hazardstatement.content">
    <xsl:attribute name="keep-together.within-line">auto</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="fo:table-column[empty(@column-width)]" mode="northfen-fix-columns">
    <xsl:copy>
      <xsl:copy-of select="@*"/>
      <xsl:attribute name="column-width">proportional-column-width(1)</xsl:attribute>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="node() | @*" mode="northfen-fix-columns">
    <xsl:copy>
      <xsl:apply-templates select="node() | @*" mode="northfen-fix-columns"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' hazard-d/hazardstatement ')]
                        [@type = 'notice']
                        [empty(*[contains(@class, ' hazard-d/hazardsymbol ')])]"
                priority="10">
    <xsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-startprop ')]" mode="outofline"/>
    <fo:table xsl:use-attribute-sets="hazardstatement">
      <xsl:call-template name="commonattributes"/>
      <xsl:call-template name="globalAtts"/>
      <xsl:call-template name="displayAtts">
        <xsl:with-param name="element" select="."/>
      </xsl:call-template>
      <fo:table-column column-width="100%"/>
      <fo:table-body>
        <fo:table-row keep-with-next="always">
          <fo:table-cell xsl:use-attribute-sets="hazardstatement.title hazardstatement.title.notice">
            <xsl:attribute name="number-columns-spanned">1</xsl:attribute>
            <fo:block>
              <fo:inline>
                <xsl:call-template name="getVariable">
                  <xsl:with-param name="id" select="'Notice'"/>
                </xsl:call-template>
              </fo:inline>
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
        <fo:table-row>
          <fo:table-cell xsl:use-attribute-sets="hazardstatement.content">
            <xsl:apply-templates select="*[contains(@class, ' hazard-d/messagepanel ')]/*"/>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>
    <xsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-endprop ')]" mode="outofline"/>
  </xsl:template>

</xsl:stylesheet>
