package demo;

import javax.servlet.annotation.WebServlet;

import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.VaadinServlet;

@WebServlet(urlPatterns = "/*", name = "AppServlet")
@VaadinServletConfiguration(ui = AppUI.class, productionMode = false)
public class AppServlet extends VaadinServlet {

}
