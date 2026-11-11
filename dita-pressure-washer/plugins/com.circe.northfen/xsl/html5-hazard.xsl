<?xml version="1.0" encoding="UTF-8"?>
<!-- ANSI Z535.6 reserves the safety alert symbol for personal injury hazards.
     NOTICE covers property damage, so a NOTICE without its own hazardsymbol
     renders with no symbol. DANGER, WARNING and CAUTION keep the toolkit default. -->
<xsl:stylesheet version="3.0"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
     xmlns:dita-ot="http://dita-ot.sourceforge.net/ns/201007/dita-ot"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     exclude-result-prefixes="dita-ot xs">

  <xsl:template match="*[contains(@class,' hazard-d/hazardstatement ')]
                        [@type = 'notice']
                        [empty(*[contains(@class,' hazard-d/hazardsymbol ')])]"
                priority="10">
    <xsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-startprop ')]"/>
    <table role="presentation" border="1">
      <xsl:call-template name="commonattributes"/>
      <tr>
        <th class="hazardstatement--notice">
          <xsl:call-template name="getVariable">
            <xsl:with-param name="id" select="'Notice'"/>
          </xsl:call-template>
        </th>
      </tr>
      <tr>
        <td>
          <xsl:apply-templates select="*[contains(@class,' hazard-d/messagepanel ')]"/>
        </td>
      </tr>
    </table>
    <xsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-endprop ')]"/>
  </xsl:template>

</xsl:stylesheet>
