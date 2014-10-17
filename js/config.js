/**
 * Created with ya3.
 * Основные настройки приложения
 * User: ZigGreen
 * Date: 2014-10-16
 * Time: 11:21 AM
 */
define([], function() {
    return {
        
        // кол-во точек
        nodesCount: 300,
        
        // сила притяжения точек
        gravity: 0.0005,
        
        // сила притяжения к курсору
        // отрицательное значение отталкивает
        cursoreGravity: -1000,
        
        // расскрашивать неравномерно? 
        randomColorize: true,
        
        // среднее время для перекраски
        // если randomColorize: false,
        // это время будет установленно 
        // для всех точек одинаково
        meanColorizeDuration: 1e4,
        
        // Ускорение движения точек
        speedFactor: 2,
        
        // цвета, которыми переливаются точки
        colors: ["red", "yellow"]
    };
});