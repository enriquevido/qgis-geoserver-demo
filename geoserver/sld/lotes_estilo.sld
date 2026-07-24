<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
    version="1.0.0"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld
                        http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">

    <NamedLayer>
        <Name>lotes_estilo</Name>
        <UserStyle>
            <Title>Lotes por estado</Title>
            <Abstract>Ocupado en rojo, Disponible en verde</Abstract>

            <FeatureTypeStyle>
                <Rule>
                    <Name>disponible</Name>
                    <Title>Disponible</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>estado</ogc:PropertyName>
                            <ogc:Literal>disponible</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#27ae60</CssParameter>
                            <CssParameter name="fill-opacity">0.6</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#1e8449</CssParameter>
                            <CssParameter name="stroke-width">2</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>

                <Rule>
                    <Name>ocupado</Name>
                    <Title>Ocupado</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>estado</ogc:PropertyName>
                            <ogc:Literal>ocupado</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#e74c3c</CssParameter>
                            <CssParameter name="fill-opacity">0.6</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#c0392b</CssParameter>
                            <CssParameter name="stroke-width">2</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>

            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>
