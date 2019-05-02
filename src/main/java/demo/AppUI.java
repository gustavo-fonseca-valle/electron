package demo;

import com.vaadin.annotations.Theme;
import com.vaadin.server.VaadinRequest;
import com.vaadin.ui.Button;
import com.vaadin.ui.Label;
import com.vaadin.ui.Notification;
import com.vaadin.ui.TextField;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.themes.ValoTheme;

@Theme(ValoTheme.THEME_NAME)
public class AppUI extends UI {

	protected void init(VaadinRequest request) {
		
		Label label = new Label();
		label.setValue("Current version:");
		label.setId("version");
		
		TextField nameField = new TextField();
		nameField.setCaption("Your name");

		Button button = new Button("Hello", event -> new Notification("Hello " + nameField.getValue()).show(getPage()));

		VerticalLayout content = new VerticalLayout();
		content.addComponents(label, nameField, button);
		setContent(content);
		
	}

}